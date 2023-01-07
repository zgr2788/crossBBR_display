# Variance confidence calculation for all genes
# ==============================================
#
# The goal here is to establish a framework through which
# intra-experiment variances are considered in order to 
# deduce whether a gene is important because it was truly
# highly expressed over all samples, or because it dominated
# by stem-cell deriven samples and came out on top.
# 
#
# @zgr2788   

import services as _services
import numpy as _np
import sys
import os

def calcVarScore(gene_id, which = "intra"):
    
    brain_samples = [key for key in list(_services.sample_tissue_map.keys()) if _services.sample_tissue_map[key] == 'Brain']

    # Calculate intra-experiment (inter-sample per run) variance
        
    var_table = {} # Keep them hashed, so that we are sure the variances belong to the correct file
    
    for id, df in _services.count_dict.items():
        
        if id not in ["Counts_cs_select.csv", "Counts_nocs_select.csv", "Counts_raw.csv"]: # Skip these 3, conclusions will not be affected
            
            try: # Get variance between samples after filtering for brain samples
                gene_series = df.loc[gene_id]
                sample_mask = [1 if gene_series.index[i] in brain_samples else 0 for i in range(len(gene_series.index))]
                gene_series_filt = [gene_series[i] for i in range(len(gene_series)) if sample_mask[i] == 1]
                gene_series_norm = _np.log1p(gene_series_filt)
                var_table[id] = _np.var(gene_series_norm)
    
            except:
                return "Gene ID not found in one of the count matrices!"
    
    var_diff_cs = var_table["Counts_cs_all.csv"] - var_table["Counts_nocs_all.csv"] # Which way stem cell deriven samples drive the expression
    var_spread = _np.var([var_table["Counts_cs_all.csv"], var_table["Counts_nocs_all.csv"]]) # Confidence score (higher -> cs vs no-cs sample difference is less significant)
    
    return (var_diff_cs, 1/var_spread)


# Fetch experiment data
gene_list = list(_services.aggreg_ref["gene_names"].values)
subj ="ENSG00000118777"  # "ENSG00000184697"
print(calcVarScore(subj, "intra"))
#intra_var_scores = [calcVarScore(gene, "intra") for gene in gene_list]
#inter_var_scores = [calcVarScore(gene, "inter") for gene in gene_list]

