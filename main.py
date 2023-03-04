import services as _services
import fastapi as _fastapi
import fastapi.templating as _templates
import fastapi.staticfiles as _StaticFiles
from starlette.responses import RedirectResponse
import jinja2 as _jinja2
from typing import Union

app = _fastapi.FastAPI()
app.mount("/static", _StaticFiles.StaticFiles(directory="Static"), name="Static")
templates = _templates.Jinja2Templates(directory = "Templates")

# Landing page
@app.get("/")
async def landing(request: _fastapi.Request):
    response = templates.TemplateResponse('landing.html', context = {'request' : request})
    return response

#################################################################

# CS excluded results page
@app.get("/omics")
async def ex_main_page(request: _fastapi.Request):
    gene_list = await _services.fetchExGeneList()
    return templates.TemplateResponse('display_ex_home.html', context = {'request' : request, 'genes_df' : gene_list[0], 'genes_deseq2_df' : gene_list[1], 'genes_deseq2_valid_df' : gene_list[2],'genes_wilcox_df' : gene_list[3], 'genes_wilcox_valid_df' : gene_list[4]})

# For intra-sample variance
@app.get("/omics/plots/intravar/{gene_id}")
async def intravar_box_plot(request: _fastapi.Request, gene_id: str):    
    await _services.fetchCountsIntraVariancePlot(gene_id, zero_filt=True, include_cs=False)

    return templates.TemplateResponse(gene_id + "_counts_intravar_box_log1p" + "_csexc.html", context={'request' : request})

# For count plots with sample info
@app.get("/omics/plots/counts/{gene_id}/")
async def counts_plot(request: _fastapi.Request, gene_id: str):    
    await _services.fetchSampleCountDistrib(gene_id, include_cs=False)

    return templates.TemplateResponse(gene_id + "_counts_whisk_log1p" + "_csexc.html", context={'request' : request})

#################################################################

# Download links page
@app.get("/downloads")
async def downloads_page(request: _fastapi.Request):
    response = templates.TemplateResponse('download_links.html', context = {'request' : request})
    return response