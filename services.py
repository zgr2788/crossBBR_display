import os
import sys
import pandas as _pd
import numpy as _np
import bokeh.io as _io
import bokeh.plotting as _plot
import bokeh.models as _plotmod
import bokeh.transform as _trans
from bokeh.palettes import Category20
from bokeh.sampledata.autompg2 import autompg2

templates = "Templates/"
counts = "Counts/"
aggreg = "Aggregs/"

count_dict = {}
aggreg_dict = {}

    
count_dict = {fname : _pd.read_csv(counts + fname, index_col=0) for fname in os.listdir(counts)}
sample_table = _pd.read_csv("sampleTable_final_ideal_dots.csv")
sample_tissue_map = { sample_table["SRR_ID"][i] : sample_table["Tissue_type"][i] for i in range(len(sample_table))}
tissues = set(list(sample_tissue_map.values()))
#aggreg_dict = {fname : _pd.read_csv(aggreg + fname, index_col=0) for fname in os.listdir(aggreg)}


# Precondition: gene_id -> str
# Returns : counts_dict = {filename : counts sum per tissue group} 
def fetchCounts(gene_id):
    counts_dict = {}
    
    for id, df in count_dict.items():
        
        
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
def fetchCountsPlot(counts_dict, gene_id, scale_type):
    

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

    if scale_type == "log1p":
        counts = [_np.log1p(count) for count in counts]
    else:
        scale_type = "sqrt"
        counts = [_np.sqrt(count) for count in counts]

    _io.output_file(gene_id + "_counts_" + scale_type + ".html")

    source = _plotmod.ColumnDataSource(data=dict(x=x, counts=counts))

    p = _plot.figure(
        x_range=_plotmod.FactorRange(*x), 
        width = int(1920 * 0.9), 
        height= int(1080 * 0.9), 
        title= gene_id + " Counts per Tissue per Run (" + scale_type + " scaled)",
        )

    p.vbar(
        x='x', 
        top='counts', 
        width=0.9, 
        source=source,
        fill_color=_trans.factor_cmap('x', palette=Category20[len(cols)], factors=cols, start=1, end=2))
    
    p.y_range.start = 0
    p.x_range.range_padding = 0.1
    p.xaxis.major_label_orientation = 1
    p.xgrid.grid_line_color = None

    _io.show(p)



# Precondition : counts -> dict from fetchCounts
# Returns : boxplot for counts across 5 runs per tissue 
def fetchCountsBoxPlot(counts_dict, gene_id, scale_type):
    

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
    
    data_qtiles = {tissue : [_np.quantile(data[tissue], quant) for quant in [0.25,0.50,0.75]] for tissue in cols}
    qtile_col_list = [data_qtiles[tissue] for tissue in cols]

    col_tis = cols*len(fnames)
    count_data = [data[tissue][i] for i in range(len(fnames)) for tissue in cols]
    q1 = [data_qtiles[tissue][0] for tissue in cols] * len(fnames)
    q2 = [data_qtiles[tissue][1] for tissue in cols] * len(fnames)
    q3 = [data_qtiles[tissue][2] for tissue in cols] * len(fnames)

    graph_df = _pd.DataFrame.from_dict({'Tissue' : col_tis, 'Count' : count_data, 'q1' : q1, 'q2' : q2, 'q3' : q3})
    print(graph_df.head())
    #print(qtile_col_list)

    """
    x = [(run, tiss) for run in fnames for tiss in cols]
    counts  = [counts_dict[fname][tiss] for fname in fnames for tiss in cols]

    if scale_type == "log1p":
        counts = [_np.log1p(count) for count in counts]
    else:
        scale_type = "sqrt"
        counts = [_np.sqrt(count) for count in counts]

    _io.output_file(gene_id + "_counts_" + scale_type + ".html")

    source = _plotmod.ColumnDataSource(data=dict(x=x, counts=counts))

    p = _plot.figure(
        x_range=_plotmod.FactorRange(*x), 
        width = int(1920 * 0.9), 
        height= int(1080 * 0.9), 
        title= gene_id + " Counts per Tissue per Run (" + scale_type + " scaled)",
        )

    p.vbar(
        x='x', 
        top='counts', 
        width=0.9, 
        source=source,
        fill_color=_trans.factor_cmap('x', palette=Category20[len(cols)], factors=cols, start=1, end=2))
    
    p.y_range.start = 0
    p.x_range.range_padding = 0.1
    p.xaxis.major_label_orientation = 1
    p.xgrid.grid_line_color = None

    _io.show(p)
    """

counts_dict, gene_id = fetchCounts("ENSG00000184697")
fetchCountsBoxPlot(counts_dict, gene_id, "log1p")


df = autompg2[["class", "hwy"]].rename(columns={"class": "kind"})

kinds = df.kind.unique()

# compute quantiles
qs = df.groupby("kind").hwy.quantile([0.25, 0.5, 0.75])
qs = qs.unstack().reset_index()
qs.columns = ["kind", "q1", "q2", "q3"]

df = _pd.merge(df, qs, on="kind", how="left")
print(df.head())
"""
# compute IQR outlier bounds
iqr = df.q3 - df.q1
df["upper"] = df.q3 + 1.5*iqr
df["lower"] = df.q1 - 1.5*iqr

source = ColumnDataSource(df)

p = figure(x_range=kinds, tools="", toolbar_location=None,
           title="Highway MPG distribution by vehicle class",
           background_fill_color="#eaefef", y_axis_label="MPG")

# outlier range
whisker = Whisker(base="kind", upper="upper", lower="lower", source=source)
whisker.upper_head.size = whisker.lower_head.size = 20
p.add_layout(whisker)

# quantile boxes
cmap = factor_cmap("kind", "TolRainbow7", kinds)
p.vbar("kind", 0.7, "q2", "q3", source=source, color=cmap, line_color="black")
p.vbar("kind", 0.7, "q1", "q2", source=source, color=cmap, line_color="black")

# outliers
outliers = df[~df.hwy.between(df.lower, df.upper)]
p.scatter("kind", "hwy", source=outliers, size=6, color="black", alpha=0.3)

p.xgrid.grid_line_color = None
p.axis.major_label_text_font_size="14px"
p.axis.axis_label_text_font_size="12px"
"""
