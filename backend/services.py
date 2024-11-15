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
import bokeh.embed as _embed
import json
from bokeh.palettes import Category20, Category10
from bokeh.sampledata.autompg2 import autompg2
from ast import literal_eval

# Folder metadata
counts = "Counts/"
aggregs = "Aggregs/"
dumps = "Lists/"

# Constants, reads etc.
count_dict = {fname : _pd.read_csv(counts + fname, index_col=0) for fname in os.listdir(counts) if ".csv" in fname}
aggreg_dict = {fname : _pd.read_csv(aggregs + fname, index_col=0) for fname in os.listdir(aggregs) if ".csv" in fname}
dumps_dict = {fname : _pd.read_csv(dumps + fname, index_col=0) for fname in os.listdir(dumps) if ".csv" in fname}
sample_table = _pd.read_csv("Metadata/sampleTable_final_ideal_dots.csv")
perf_score_ref  = _pd.read_csv("Metadata/gene_perf_rate_master.csv", index_col=0)
sample_tissue_map = { sample_table["SRR_ID"][i] : sample_table["Tissue_type"][i] for i in range(len(sample_table))}
tissues = list(set(list(sample_tissue_map.values())))
tissListFull = ['Cornea', 'Heart', 'Liver', 'Umbilical vein', 'Lymph node', 'Sciatic nerve', 'Colon', 'Vessel', 'Peripheral blood', 'Lung', 'Skin', 'Kidney', 'Intestine', 'Tonsil']
tissListSelect = ['Colon', 'Heart', 'Intestine', 'Kidney', 'Liver', 'Lung', 'Vessel']

# Wrapper for gene perfusion scores
def perfWrapper(gene_id, ref=perf_score_ref):
    try:
        score = perf_score_ref["meanPerfusionScore"][gene_id]
    
    except:
        score = -1
    
    return score

# Pre-process aggregate files
for key in list(aggreg_dict.keys()):
    aggreg_dict[key]["mean_perf_score"] = aggreg_dict[key]["Name"].apply(lambda x: perfWrapper(x)) # Perf
    aggreg_dict[key]["Score"] = aggreg_dict[key]["Score"].apply(lambda x : -_np.log10(x)) # Score change
    aggreg_dict[key] = aggreg_dict[key][["Name", "gene_names", "uniprot", "Score", "DESeq2_Appeared", "DESeq2_Validated", "Wilcox_Appeared", "Wilcox_Validated", "Prot_Evidence", "mean_perf_score"]] # Reorder for pretty exports

# Pre-process dumps files
for key in list(dumps_dict.keys()):
    dumps_dict[key]["Gene_ID"] = dumps_dict[key].index
    dumps_dict[key]["tissList_array"] = dumps_dict[key]["tissList"].apply(literal_eval)
    dumps_dict[key]["tissList_array"] = dumps_dict[key]["tissList_array"].apply(lambda x: [tiss.replace('.', ' ') for tiss in x ])

    if 'all' in key:
        for tiss in tissListFull:
            dumps_dict[key][tiss] = dumps_dict[key]["tissList_array"].apply(lambda x : tiss in x)

    else:
        for tiss in tissListSelect:
            dumps_dict[key][tiss] = dumps_dict[key]["tissList_array"].apply(lambda x : tiss in x)


    # Precise re-order before send
    if "deseq2_all" in key:
        dumps_dict[key] = dumps_dict[key][["Gene_ID", "hgncSymbol", "sigAdj", "log2FoldChange", "appCount", 'Cornea', 'Heart', 'Liver', 'Umbilical vein', 'Lymph node', 'Sciatic nerve', 'Colon', 'Vessel', 'Peripheral blood', 'Lung', 'Skin', 'Kidney', 'Intestine', 'Tonsil']]
    


# Precondition : none
# Returns : Gene list -> List of genes with attributes for SC excluded

async def fetchExGeneList(typeof : str):
    return aggreg_dict["aggreg_" + typeof + ".csv"]


# Precondition : none
# Returns : Dump list -> List of genes from experiments

async def fetchDumpList(typeof : str):
    return dumps_dict[typeof + ".csv"]

# Precondition : counts -> count_dict primitive, NOT from fetchCounts
# Returns : Sample count distribution in runs per tissue  
async def fetchSampleCountDistrib(gene_id, zero_filt = False, count_dict = count_dict, scale_type = "log1p", include_cs = False):
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

        return json.dumps(_embed.json_item(p, gene_id + "_counts_whisk_" + scale_type))



