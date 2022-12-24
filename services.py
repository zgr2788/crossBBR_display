import os
import sys
import pandas as _pd
import numpy as _np
import bokeh.io as _io
import bokeh.plotting as _plot
import bokeh.models as _plotmod
import bokeh.transform as _trans
from bokeh.palettes import Category20

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
        width = 1920, 
        height=1080, 
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


