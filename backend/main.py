import services as _services
import fastapi as _fastapi

app = _fastapi.FastAPI()

# Landing page
@app.get("/api/")
async def landing():
    return {"message" : "API for BBB Data Repo"}

#################################################################

# CS excluded results page
@app.get("/api/omics/data/{typeof}")
async def ex_main_page(typeof: str):

    if typeof not in ["all", "deseq2", "wilcox", "deseq2_valid", "wilcox_valid"]:
        raise _fastapi.HTTPException(status_code = 404, detail = "Table identifier not found!")

    gene_list = await _services.fetchExGeneList(typeof=typeof)
    return gene_list.to_json(orient="index")

@app.get("/api/omics/dumps/{typeof}")
async def dump_tables(typeof: str):

    if typeof not in ["deseq2_all", "deseq2_select", "wilcox_all", "wilcox_select"]:
        raise _fastapi.HTTPException(status_code = 404, detail = "Table identifier not found!")

    gene_list = await _services.fetchDumpList(typeof=typeof)
    return gene_list.to_json(orient="index") 


# For count plots with sample info
@app.get("/api/omics/plots/counts/{gene_id}/")
async def counts_plot(gene_id: str):
    return await _services.fetchSampleCountDistrib(gene_id, include_cs=False)

#################################################################