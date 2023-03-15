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

# Folder metadata
counts = "Counts/"
aggreg = "Aggregs/"

count_dict = {}
aggreg_dict = {}

count_dict = {fname : _pd.read_csv(counts + fname, index_col=0) for fname in os.listdir(counts) if ".csv" in fname}
sample_table = _pd.read_csv("Metadata/sampleTable_final_ideal_dots.csv")
perf_score_ref  = _pd.read_csv("Metadata/gene_perf_rate_master.csv", index_col=0)
sample_tissue_map = { sample_table["SRR_ID"][i] : sample_table["Tissue_type"][i] for i in range(len(sample_table))}
tissues = list(set(list(sample_tissue_map.values())))

# Wrapper for gene perfusion scores
def perfWrapper(gene_id, ref=perf_score_ref):
    try:
        score = perf_score_ref["meanPerfusionScore"][gene_id]
    
    except:
        score = -1
    
    return score

# Read and construct aggregation reference
aggreg_ex_ref = _pd.read_csv("Aggregs/aggreg_all.csv", index_col=0)
aggreg_ex_deseq2 = _pd.read_csv("Aggregs/aggreg_deseq2.csv", index_col=0)
aggreg_ex_deseq2_valid = _pd.read_csv("Aggregs/aggreg_deseq2_valid.csv", index_col=0)
aggreg_ex_wilcox = _pd.read_csv("Aggregs/aggreg_wilcox.csv", index_col=0)
aggreg_ex_wilcox_valid = _pd.read_csv("Aggregs/aggreg_wilcox_valid.csv", index_col=0)

# Add perfusion scores to aggregates
aggreg_ex_ref["Mean Perfusion Score"] = aggreg_ex_ref["Name"].apply(lambda x: perfWrapper(x))
aggreg_ex_deseq2["Mean Perfusion Score"] = aggreg_ex_deseq2["Name"].apply(lambda x: perfWrapper(x))
aggreg_ex_deseq2_valid["Mean Perfusion Score"] = aggreg_ex_deseq2_valid["Name"].apply(lambda x: perfWrapper(x))
aggreg_ex_wilcox["Mean Perfusion Score"] = aggreg_ex_wilcox["Name"].apply(lambda x: perfWrapper(x))
aggreg_ex_wilcox_valid["Mean Perfusion Score"] = aggreg_ex_wilcox_valid["Name"].apply(lambda x: perfWrapper(x))

# Map uniprot ids to links
aggreg_ex_ref["uniprot"] = aggreg_ex_ref["uniprot"].apply(lambda x : "https://www.ebi.ac.uk/interpro/search/text/" + str(x))
aggreg_ex_deseq2["uniprot"] = aggreg_ex_deseq2["uniprot"].apply(lambda x : "https://www.ebi.ac.uk/interpro/search/text/" + str(x))
aggreg_ex_deseq2_valid["uniprot"] = aggreg_ex_deseq2_valid["uniprot"].apply(lambda x : "https://www.ebi.ac.uk/interpro/search/text/" + str(x))
aggreg_ex_wilcox["uniprot"] = aggreg_ex_wilcox["uniprot"].apply(lambda x : "https://www.ebi.ac.uk/interpro/search/text/" + str(x))
aggreg_ex_wilcox_valid["uniprot"] = aggreg_ex_wilcox_valid["uniprot"].apply(lambda x : "https://www.ebi.ac.uk/interpro/search/text/" + str(x))




# Precondition : none
# Returns : Gene list -> List of genes with attributes for SC excluded

async def fetchExGeneList():
    return [aggreg_ex_ref, aggreg_ex_deseq2, aggreg_ex_deseq2_valid, aggreg_ex_wilcox, aggreg_ex_wilcox_valid]

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

    p.y_range.start = 0
    p.x_range.range_padding = 0.1
    p.xaxis.major_label_orientation = 1
    p.xgrid.grid_line_color = None

    _io.save(p)

# Precondition : counts -> count_dict primitive, NOT from fetchCounts
# Returns : Sample count distribution in runs per tissue  
async def fetchSampleCountDistrib(gene_id, zero_filt = False, count_dict = count_dict, scale_type = "log1p", include_cs = False):
    if not os.path.exists("Templates/" + gene_id + "_counts_whisk_" + scale_type + "_csexc.html"):
        graph_df_list = []
        
        # Switch brain to 1st level
        if tissues[0] != "Brain":
            idx = 1
            
            while tissues[idx] != "Brain":
                idx += 1
            
            temp = tissues[0]
            tissues[0] = tissues[idx]
            tissues[idx] = temp 
    
        # Get whisker plot data for each tissue
        for tissue in tissues:
            graph_df = _pd.DataFrame(columns = ["Tissue", "Count", "lower", "middle", "upper"])
            tiss_samples = [key for key in list(sample_tissue_map.keys()) if sample_tissue_map[key] == tissue]
    
            # Construct data corpus
            for id, df in count_dict.items():
            
                if id not in ["Counts_cs_select.csv", "Counts_nocs_select.csv", "Counts_raw.csv"]:
                
                    if include_cs or ("nocs" in id):
                    
                        try:
                            gene_series = df.loc[gene_id]
                            sample_mask = [1 if gene_series.index[i] in tiss_samples else 0 for i in range(len(gene_series.index))]
                            gene_series_filt = [gene_series[i] for i in range(len(gene_series)) if sample_mask[i] == 1]
    
                            if zero_filt:
                                gene_series_filt = [count for count in gene_series_filt if count != 0]
    
                            gene_series_norm = _np.log1p(gene_series_filt)
    
                            lower, middle, upper = (_np.quantile(gene_series_norm, quant) for quant in [0.25, 0.5, 0.75])
    
                            cur_df = _pd.DataFrame.from_dict({
                                "Tissue" : [tissue]*len(gene_series_norm), 
                                "Count" : gene_series_norm, 
                                "lower" : lower,
                                "middle" : middle, 
                                "upper" : upper 
                            })
    
                            graph_df = _pd.concat([graph_df, cur_df])
    
                        except:
                            return "Gene ID not found in one of the count matrices!"
            
            graph_df_list.append(graph_df)
        
        # Get plot y axis limit
        y_max = 0
    
        for df in graph_df_list:
            y_max = max(y_max, max([num for num in df.to_numpy().flatten() if isinstance(num, float)]))
    
        
        # Construct the plot
        if include_cs: # Unused
            _io.output_file("Templates/" + gene_id + "_counts_whisk_" + scale_type + ".html", title=gene_id + "_counts_whisk_" + scale_type)
        else:
            _io.output_file("Templates/" + gene_id + "_counts_whisk_" + scale_type + "_csexc.html", title=gene_id + "_counts_whisk_" + scale_type)
        
        _plot.curdoc().theme = 'light_minimal'
    
        p = _plot.figure(
            x_range=_plotmod.FactorRange(*tissues, bounds="auto"),
            title= gene_id + " counts sample variance across Tissues",
            y_axis_label="Normalized counts (log1p)",
            x_axis_label="Tissues",
            width = int(1920 * 0.9), 
            height= int(1080 * 0.9),
            sizing_mode='scale_width',
            y_range=_plotmod.Range1d(0, y_max+1, bounds="auto")
        )
    
        for df in graph_df_list:
            source = _plotmod.ColumnDataSource(df)
    
            whisker = _plotmod.Whisker(base="Tissue", upper="upper", lower="lower", source=source, level="annotation", line_width = 1)
            mid = _plotmod.Whisker(base="Tissue", upper="middle", lower="middle", source=source, level="annotation", line_width = 2)
            whisker.upper_head.size = whisker.lower_head.size = 20
            mid.upper_head.size = mid.lower_head.size = 40
            mid.upper_head.line_color = mid.lower_head.line_color = 'red'
            p.add_layout(whisker)
            p.add_layout(mid)
    
            cmap = _trans.factor_cmap("Tissue", palette=Category20[len(tissues)], factors=tissues)
            p.circle(_trans.jitter("Tissue", 0.3, range=p.x_range), "Count", source=df,
                alpha=0.2, size=13, line_color="white",
                color=cmap)
    
        p.y_range.start = 0
        p.x_range.range_padding = 0.1
        p.xaxis.major_label_orientation = 1
        p.xgrid.grid_line_color = None
    
        _io.save(p)

