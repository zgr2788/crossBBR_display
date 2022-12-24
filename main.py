import sys

try:
    gene_id = sys.argv[1]
    scale_type = sys.argv[2]
except:
    print("Insufficient args")
    sys.exit()

import services as _services


try:
    counts_dict, gene_id = _services.fetchCounts(gene_id)
except:
    print("Gene ID not recognized")
    sys.exit()

_services.fetchCountsPlot(counts_dict, gene_id, scale_type)