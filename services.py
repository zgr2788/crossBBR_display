import os
import sys
import pandas as _pd
import numpy as _np
import fastapi as _fastapi
import pickle as _pickle
import bokeh.io as _io
import bokeh.plotting as _plot
import bokeh.models as _plotmod
import bokeh.transform as _trans
from bokeh.palettes import Category20, Category10
from bokeh.sampledata.autompg2 import autompg2

counts = "Counts/"
aggreg = "Aggregs/"

count_dict = {}
aggreg_dict = {}
var_info = None

# Read data
with open("Counts/var_info.pickle", "rb") as f:
    var_info = _pickle.load(f)
    f.close()

with open("Counts/var_info_nonzero.pickle", "rb") as f:
    var_info_nz = _pickle.load(f)
    f.close()

count_dict = {fname : _pd.read_csv(counts + fname, index_col=0) for fname in os.listdir(counts) if ".csv" in fname}
sample_table = _pd.read_csv("sampleTable_final_ideal_dots.csv")
sample_tissue_map = { sample_table["SRR_ID"][i] : sample_table["Tissue_type"][i] for i in range(len(sample_table))}
tissues = set(list(sample_tissue_map.values()))

# Read and construct aggregation reference
aggreg_ref = _pd.read_csv("Aggregs/aggreg.csv")
aggreg_ex_ref = _pd.read_csv("Aggregs/aggreg_all.csv")
aggreg_ex_deseq2 = _pd.read_csv("Aggregs/aggreg_deseq2.csv")
aggreg_ex_deseq2_valid = _pd.read_csv("Aggregs/aggreg_deseq2_valid.csv")
aggreg_ex_wilcox = _pd.read_csv("Aggregs/aggreg_wilcox.csv")
aggreg_ex_wilcox_valid = _pd.read_csv("Aggregs/aggreg_wilcox_valid.csv")

# Variance impact - with 0's considered as biological variance
aggreg_ref["Variance Impact"] = [var_info[gene_name][0] for gene_name in aggreg_ref["Name"].values]
aggreg_ref["Confidence Score"] = _np.log1p([var_info[gene_name][1] for gene_name in aggreg_ref["Name"].values])
aggreg_ref["Variance Confidence Score"] = ( aggreg_ref["Confidence Score"] - aggreg_ref["Confidence Score"] .min()) / (aggreg_ref["Confidence Score"] .max() - aggreg_ref["Confidence Score"] .min()) * 100

aggreg_ref["Variance Impact"] = aggreg_ref["Variance Impact"].apply(lambda x: '{0:.2f}'.format(x))
aggreg_ref["Variance Confidence Score"] = aggreg_ref["Variance Confidence Score"].apply(lambda x: '{0:.2f}'.format(x))

# Variance impact - with 0's considered as technical variance, therefore filtered
aggreg_ref["Variance Impact - Zerofilt"] = [var_info_nz[gene_name][0] for gene_name in aggreg_ref["Name"].values]
aggreg_ref["Confidence Score - Zerofilt"] = _np.log1p([var_info_nz[gene_name][1] for gene_name in aggreg_ref["Name"].values])
aggreg_ref["Variance Confidence Score - Zerofilt"] = ( aggreg_ref["Confidence Score - Zerofilt"] - aggreg_ref["Confidence Score - Zerofilt"] .min()) / (aggreg_ref["Confidence Score - Zerofilt"] .max() - aggreg_ref["Confidence Score - Zerofilt"] .min()) * 100

aggreg_ref["Variance Impact - Zerofilt"] = aggreg_ref["Variance Impact - Zerofilt"].apply(lambda x: '{0:.2f}'.format(x))
aggreg_ref["Variance Confidence Score - Zerofilt"] = aggreg_ref["Variance Confidence Score - Zerofilt"].apply(lambda x: '{0:.2f}'.format(x))

# Precondition : none
# Returns : Gene list -> List of genes with attributes

async def fetchGeneList():
    return(aggreg_ref)


# Precondition : none
# Returns : Gene list -> List of genes with attributes for SC excluded

async def fetchExGeneList(which = "All"):
    opts = ["All", "DESeq2", "Wilcox", "DESeq2 Validation", "Wilcox Validation"]

    if which not in opts:
        raise _fastapi.HTTPException(404, "Unexpected input on results!")
    

    if which == "All":
        return aggreg_ex_ref
    
    elif which == "DESeq2":
        return aggreg_ex_deseq2
    
    elif which == "Wilcox":
        return aggreg_ex_wilcox

    elif which == "DESeq2 Validation":
        return aggreg_ex_deseq2_valid 
    
    else :
        return aggreg_ex_wilcox_valid
    

# Precondition: gene_id -> str
# Returns : counts_dict = {filename : counts sum per tissue group} 
async def fetchCounts(gene_id, include_cs = True):
    counts_dict = {}
    
    for id, df in count_dict.items():
        
        if include_cs or (("nocs" in id) or ("raw" in id)):
            
            try:
                gene_series = df.loc[gene_id]
            except:
                return "Gene ID not found in one of the count matrices!"

            gene_tis_dict = {tis_name : 0 for tis_name in tissues}

            for sample_name in gene_series.index:
                gene_tis_dict[sample_tissue_map[sample_name]] += gene_series[sample_name]

            counts_dict[id] = gene_tis_dict

    return counts_dict, gene_id 


# Precondition : counts -> dict from fetchCounts
# Returns : plot for counts per tissue per sample
async def fetchCountsPlot(counts_dict, gene_id, scale_type = "log1p", include_cs = True):
    
    # Get data corpus
    fnames = list(counts_dict.keys())
    cols = list(counts_dict["Counts_raw.csv"].keys())

    if cols[0] != "Brain":
        idx = 1
        
        while cols[idx] != "Brain":
            idx += 1
        
        temp = cols[0]
        cols[0] = cols[idx]
        cols[idx] = temp 


    data = {}

    for tissue in cols:
        tiss_count_list = [counts_dict[fname][tissue] for fname in fnames]
        data[tissue] = tiss_count_list

    data['run'] = fnames


    x = [(run, tiss) for run in fnames for tiss in cols]
    counts  = [counts_dict[fname][tiss] for fname in fnames for tiss in cols]

    # Scale values, sqrt disabled on deploy
    if scale_type == "log1p":
        counts = [_np.log1p(count) for count in counts]
    else:
        scale_type = "sqrt"
        counts = [_np.sqrt(count) for count in counts]

    # Plot output
    if include_cs:
        _io.output_file("Templates/" + gene_id + "_counts_" + scale_type + ".html", title=gene_id + "_counts_" + scale_type)
    
    else:
        _io.output_file("Templates/" + gene_id + "_counts_" + scale_type + "_csexc.html", title=gene_id + "_counts_" + scale_type)
    
    _plot.curdoc().theme = 'light_minimal'

    source = _plotmod.ColumnDataSource(data=dict(x=x, counts=counts))

    p = _plot.figure(
        x_range=_plotmod.FactorRange(*x, bounds = "auto"),
        y_range= _plotmod.Range1d(0, max(counts), bounds="auto"),
        width = int(1920 * 0.9), 
        height= int(1080 * 0.9), 
        title= gene_id + " Counts per Tissue per Run (" + scale_type + " scaled)",
        y_axis_label="Normalized Count",
        sizing_mode='scale_width'
        )

    p.vbar(
        x='x', 
        top='counts', 
        width=0.9, 
        source=source,
        fill_color=_trans.factor_cmap('x', palette=Category20[len(cols)], factors=cols, start=1, end=2))
    
    p.xaxis.major_label_orientation = 1
    p.xgrid.grid_line_color = None

    _io.save(p)


# Precondition : counts -> dict from fetchCounts
# Returns : boxplot for counts across 3 or 5 runs per tissue 
async def fetchCountsBoxPlot(counts_dict, gene_id, scale_type = "log1p", include_cs = True):
    
    # Construct data corpus
    fnames = list(counts_dict.keys())
    cols = list(counts_dict["Counts_raw.csv"].keys())

    if cols[0] != "Brain":
        idx = 1
        
        while cols[idx] != "Brain":
            idx += 1
        
        temp = cols[0]
        cols[0] = cols[idx]
        cols[idx] = temp 


    data = {}

    for tissue in cols:
        tiss_count_list = [counts_dict[fname][tissue] for fname in fnames]
        data[tissue] = tiss_count_list
    
    # Mask 0 values for less vital organs, include only 2/4 comparisons, fill rest with average of two
    # Theoretically decreases confidence, but logical since they are bound to be 0 in the other 2 comparisons
    for key in list(data.keys()):
        cur_list = data[key]
        temp_avg = (max(cur_list) + min(cur_list)) / 2.0
        cur_list = [cur_list[i] if cur_list[i] != 0 else temp_avg for i in range(len(cur_list))]
        data[key] = cur_list
    
    data_qtiles = {tissue : [_np.quantile(data[tissue], quant) for quant in [0.25,0.50,0.75]] for tissue in cols}
    qtile_col_list = [data_qtiles[tissue] for tissue in cols]

    col_tis = cols*len(fnames)
    count_data = [data[tissue][i] for i in range(len(fnames)) for tissue in cols]
    q1 = [data_qtiles[tissue][0] for tissue in cols] * len(fnames)
    q2 = [data_qtiles[tissue][1] for tissue in cols] * len(fnames)
    q3 = [data_qtiles[tissue][2] for tissue in cols] * len(fnames)

    graph_df = _pd.DataFrame.from_dict({
        'Tissue' : col_tis, 
        'Count' : count_data, 
        'q1' : q1, 
        'q2' : q2, 
        'q3' : q3
    })


    # Scale values, sqrt disabled on deploy
    if scale_type == "log1p":
        graph_df["Count"] = _np.log1p(graph_df["Count"])
        graph_df["q1"] = _np.log1p(graph_df["q1"])
        graph_df["q2"] = _np.log1p(graph_df["q2"])
        graph_df["q3"] = _np.log1p(graph_df["q3"])

    else:
        scale_type = "sqrt"
        graph_df["Count"] = _np.sqrt(graph_df["Count"])
        graph_df["q1"] = _np.sqrt(graph_df["q1"])
        graph_df["q2"] = _np.sqrt(graph_df["q2"])
        graph_df["q3"] = _np.sqrt(graph_df["q3"])


    # Plot output
    if include_cs:
        _io.output_file("Templates/" + gene_id + "_counts_boxplot_" + scale_type + ".html", title=gene_id + "_counts_boxplot_" + scale_type)
    
    else:
        _io.output_file("Templates/" + gene_id + "_counts_boxplot_" + scale_type + "_csexc.html", title=gene_id + "_counts_boxplot_" + scale_type)
    _plot.curdoc().theme = 'light_minimal'


    iqr = graph_df.q3 - graph_df.q1
    graph_df["upper"] = graph_df.q3 + 1.5*iqr
    graph_df["lower"] = graph_df.q1 - 1.5*iqr
    graph_df.lower = [max(curVal, 0) for curVal in graph_df.lower]


    source = _plotmod.ColumnDataSource(graph_df)

    p = _plot.figure(
        x_range=_plotmod.FactorRange(*cols, bounds="auto"),
        title= gene_id + " counts distribution across Runs per Tissue",
        y_axis_label="Normalized counts",
        width = int(1920 * 0.9), 
        height= int(1080 * 0.9),
        sizing_mode='scale_width',
        y_range=_plotmod.Range1d(0, max([num for num in graph_df.to_numpy().flatten() if isinstance(num, float)]), bounds="auto")
    )

    whisker = _plotmod.Whisker(base="Tissue", upper="upper", lower="lower", source=source)
    whisker.upper_head.size = whisker.lower_head.size = 20
    p.add_layout(whisker)

    cmap = _trans.factor_cmap("Tissue", palette=Category20[len(cols)], factors=cols)
    p.vbar("Tissue", 0.7, "q2", "q3", source=source, color=cmap, line_color="black")
    p.vbar("Tissue", 0.7, "q1", "q2", source=source, color=cmap, line_color="black")

    outliers = graph_df[~graph_df.Count.between(graph_df.lower, graph_df.upper)]
    p.scatter("Tissue", "Count", source=outliers, size=6, color="black", alpha=0.3)

    p.y_range.start = 0
    p.x_range.range_padding = 0.1
    p.xaxis.major_label_orientation = 1
    p.xgrid.grid_line_color = None

    _io.save(p)


# Precondition : counts -> count_dict primitive, NOT from fetchCounts
# Returns : Intrasample variance plot for brain over 2 runs (cs +-) or only noCS
async def fetchCountsIntraVariancePlot(gene_id, zero_filt = False, count_dict = count_dict, scale_type = "log1p", include_cs = True):
    
    graph_df = _pd.DataFrame(columns = ["Run", "Count", "lower", "upper"])
    fnames = []
    brain_samples = [key for key in list(sample_tissue_map.keys()) if sample_tissue_map[key] == 'Brain']
    
    # Construct data corpus
    for id, df in count_dict.items():
        
        if id not in ["Counts_cs_select.csv", "Counts_nocs_select.csv", "Counts_raw.csv"]: # Skip these 3, conclusions will not be affected
            
            if include_cs or ("nocs" in id):
                
                fnames.append(id)
                try:
                    gene_series = df.loc[gene_id]
                    sample_mask = [1 if gene_series.index[i] in brain_samples else 0 for i in range(len(gene_series.index))]
                    gene_series_filt = [gene_series[i] for i in range(len(gene_series)) if sample_mask[i] == 1]

                    if zero_filt:
                        gene_series_filt = [count for count in gene_series_filt if count != 0]

                    gene_series_norm = _np.log1p(gene_series_filt)

                    lower, upper = (_np.quantile(gene_series_norm, quant) for quant in [0.20,0.80])

                    cur_df = _pd.DataFrame.from_dict({
                        "Run" : [id]*len(gene_series_norm), 
                        "Count" : gene_series_norm, 
                        "lower" : lower, 
                        "upper" : upper 
                    })

                    graph_df = _pd.concat([graph_df, cur_df])

                except:
                    return "Gene ID not found in one of the count matrices!"
    
    # Plot Output
    if include_cs:
        _io.output_file("Templates/" + gene_id + "_counts_intravar_box_" + scale_type + ".html", title=gene_id + "_counts_boxplot_" + scale_type)
    else:
        _io.output_file("Templates/" + gene_id + "_counts_intravar_box_" + scale_type + "_csexc.html", title=gene_id + "_counts_boxplot_" + scale_type)
    
    _plot.curdoc().theme = 'light_minimal'

    source = _plotmod.ColumnDataSource(graph_df)

    p = _plot.figure(
        x_range=_plotmod.FactorRange(*fnames, bounds="auto"),
        title= gene_id + " counts intrasample variance across Runs",
        y_axis_label="Normalized counts",
        width = int(1920 * 0.9), 
        height= int(1080 * 0.9),
        sizing_mode='scale_width',
        y_range=_plotmod.Range1d(0, max([num for num in graph_df.to_numpy().flatten() if isinstance(num, float)]), bounds="auto")
    )

    whisker = _plotmod.Whisker(base="Run", upper="upper", lower="lower", source=source, level="annotation", line_width = 2)
    whisker.upper_head.size = whisker.lower_head.size = 20
    p.add_layout(whisker)

    cmap = _trans.factor_cmap("Run", palette=Category10[3], factors=fnames)
    p.circle(_trans.jitter("Run", 0.3, range=p.x_range), "Count", source=graph_df,
         alpha=0.5, size=13, line_color="white",
         color=cmap)
    #p.vbar("Run", 0.7, "q2", "q3", source=source, color=cmap, line_color="black")
    #p.vbar("Run", 0.7, "q1", "q2", source=source, color=cmap, line_color="black")

    #outliers = graph_df[~graph_df.Count.between(graph_df.lower, graph_df.upper)]
    #p.scatter("Run", "Count", source=outliers, size=6, color="black", alpha=0.3)

    p.y_range.start = 0
    p.x_range.range_padding = 0.1
    p.xaxis.major_label_orientation = 1
    p.xgrid.grid_line_color = None

    _io.save(p)
