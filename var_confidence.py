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
import pickle as _pickle

def calcVarScore(gene_id, filter_zeros = False , which = "intra"):
    
    brain_samples = [key for key in list(_services.sample_tissue_map.keys()) if _services.sample_tissue_map[key] == 'Brain']

    # Calculate intra-experiment (inter-sample per run) variance
        
    std_table = {} # Keep them hashed, so that we are sure the variances belong to the correct file
    med_table = {}
    for id, df in _services.count_dict.items():
        
        if id not in ["Counts_cs_select.csv", "Counts_nocs_select.csv", "Counts_raw.csv"]: # Skip these 3, conclusions will not be affected
            
            try: # Get variance between samples after filtering for brain samples
                gene_series = df.loc[gene_id]
                sample_mask = [1 if gene_series.index[i] in brain_samples else 0 for i in range(len(gene_series.index))]
                gene_series_filt = [gene_series[i] for i in range(len(gene_series)) if sample_mask[i] == 1]

                if filter_zeros:
                    gene_series_filt = [count for count in gene_series_filt if count != 0]
                
                gene_series_norm = _np.log1p(gene_series_filt)
                std_table[id] = _np.std(gene_series_norm)
                med_table[id] = _np.median(gene_series_norm)


            except Exception as err:
                return err # "Gene ID not found in one of the count matrices!"
    
    median_avg = _np.average([std_table["Counts_cs_all.csv"], std_table["Counts_nocs_all.csv"]]) # Normalize variance spread by average
    std_diff_cs = std_table["Counts_cs_all.csv"] - std_table["Counts_nocs_all.csv"] # Which way stem cell deriven samples drive the expression
    std_spread = _np.std([std_table["Counts_cs_all.csv"], std_table["Counts_nocs_all.csv"]]) # Confidence score (higher -> cs vs no-cs sample difference is less significant)
    
    return (std_diff_cs, median_avg/std_spread)


# Fetch experiment data
gene_list = list(_services.aggreg_ref["Name"].values)
intra_var_scores = {gene : calcVarScore(gene) for gene in gene_list}
intra_var_nonzero_scores = {gene : calcVarScore(gene, filter_zeros=True) for gene in gene_list}

with open('var_info.pickle', 'wb') as f:
    _pickle.dump(intra_var_scores, f)
    f.close()

with open('var_info_nonzero.pickle', 'wb') as f:
    _pickle.dump(intra_var_nonzero_scores, f)
    f.close()




