import sys

try:
    service = sys.argv[1]
    gene_id = sys.argv[2]
    scale_type = sys.argv[3]
except:
    print("Insufficient args")
    sys.exit()

import services as _services

# ctr
if service == "ctr":
    try:
        counts_dict, gene_id = _services.fetchCounts(gene_id)
    except:
        print("Gene ID not recognized")
        sys.exit()
    _services.fetchCountsPlot(counts_dict, gene_id, scale_type)

#ctr-box
elif service == "ctrbox":
    try:
        counts_dict, gene_id = _services.fetchCounts(gene_id)
    except:
        print("Gene ID not recognized")
        sys.exit()
    _services.fetchCountsBoxPlot(counts_dict, gene_id, scale_type)

else:
    print("Service not recognized")
    sys.exit()