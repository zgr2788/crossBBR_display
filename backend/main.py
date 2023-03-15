import services as _services
import fastapi as _fastapi
import fastapi.templating as _templates
import fastapi.staticfiles as _StaticFiles
from starlette.responses import RedirectResponse
import jinja2 as _jinja2
from typing import Union

app = _fastapi.FastAPI()
templates = _templates.Jinja2Templates(directory = "Templates")

# Landing page
@app.get("/api/")
async def landing():
    return {"message" : "API for BBB Data Repo"}

#################################################################

# CS excluded results page
@app.get("/api/omics/all/")
async def ex_main_page():
    gene_list = await _services.fetchExGeneList()
    return gene_list[0].to_json(orient="index")

@app.get("/api/omics/deseq2/")
async def ex_deseq2_page():
    gene_list = await _services.fetchExGeneList()
    return gene_list[1].to_json(orient="index")

@app.get("/api/omics/wilcox/")
async def ex_wilcox_page():
    gene_list = await _services.fetchExGeneList()
    return gene_list[3].to_json(orient="index")

@app.get("/api/omics/deseq2valid/")
async def ex_deseq2v_page():
    gene_list = await _services.fetchExGeneList()
    return gene_list[2].to_json(orient="index")

@app.get("/api/omics/wilcoxvalid/")
async def ex_wilcoxv_page():
    gene_list = await _services.fetchExGeneList()
    return gene_list[4].to_json(orient="index")


# For intra-sample variance
@app.get("/api/omics/plots/intravar/{gene_id}/")
async def intravar_box_plot(request: _fastapi.Request, gene_id: str):    
    await _services.fetchCountsIntraVariancePlot(gene_id, zero_filt=True, include_cs=False)

    return templates.TemplateResponse(gene_id + "_counts_intravar_box_log1p" + "_csexc.html", context={'request' : request})


# For count plots with sample info
@app.get("/api/omics/plots/counts/{gene_id}/")
async def counts_plot(request: _fastapi.Request, gene_id: str):    
    await _services.fetchSampleCountDistrib(gene_id, include_cs=False)

    return templates.TemplateResponse(gene_id + "_counts_whisk_log1p" + "_csexc.html", context={'request' : request})

#################################################################

# Download links page
@app.get("/api/downloads")
async def downloads_page(request: _fastapi.Request):
    response = templates.TemplateResponse('download_links.html', context = {'request' : request})
    return response