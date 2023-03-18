import services as _services
import fastapi as _fastapi
import fastapi.templating as _templates
import fastapi.staticfiles as _StaticFiles
from starlette.responses import RedirectResponse
from typing import Union
from typing import List 
from pydantic import BaseModel

app = _fastapi.FastAPI()

class DataModel(BaseModel):
    sortArgs : List[List[str]]

# Landing page
@app.get("/api/")
async def landing():
    return {"message" : "API for BBB Data Repo"}

#################################################################

# CS excluded results page
@app.post("/api/omics/all/")
async def ex_main_page(request: _fastapi.Request):
    data = DataModel(sortArgs = await request.json()).sortArgs
    gene_list = await _services.fetchExGeneList()
    gene_list = await _services.sortList(glist = gene_list[0], sortArgs=data)
    return gene_list.to_json(orient="index")

@app.post("/api/omics/deseq2/")
async def ex_deseq2_page(request: _fastapi.Request):
    data = DataModel(sortArgs = await request.json()).sortArgs
    gene_list = await _services.fetchExGeneList()
    gene_list = await _services.sortList(glist = gene_list[1], sortArgs=data)
    return gene_list.to_json(orient="index")

@app.post("/api/omics/wilcox/")
async def ex_wilcox_page(request: _fastapi.Request):
    data = DataModel(sortArgs = await request.json()).sortArgs
    gene_list = await _services.fetchExGeneList()
    gene_list = await _services.sortList(glist = gene_list[3], sortArgs=data)
    return gene_list.to_json(orient="index")

@app.post("/api/omics/deseq2valid/")
async def ex_deseq2v_page(request: _fastapi.Request):
    data = DataModel(sortArgs = await request.json()).sortArgs
    gene_list = await _services.fetchExGeneList()
    gene_list = await _services.sortList(glist = gene_list[2], sortArgs=data)
    return gene_list.to_json(orient="index")

@app.post("/api/omics/wilcoxvalid/")
async def ex_wilcoxv_page(request : _fastapi.Request):
    data = DataModel(sortArgs = await request.json()).sortArgs
    gene_list = await _services.fetchExGeneList()
    gene_list = await _services.sortList(glist = gene_list[4], sortArgs=data)
    return gene_list.to_json(orient="index")

# For count plots with sample info
@app.get("/api/omics/plots/counts/{gene_id}/")
async def counts_plot(request: _fastapi.Request, gene_id: str):
    return await _services.fetchSampleCountDistrib(gene_id, include_cs=False)

#################################################################