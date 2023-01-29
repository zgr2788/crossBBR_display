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
    response.set_cookie(key="exmode", value="all")
    return response

# CS excluded results page
@app.get("/csexc")
async def ex_main_page(request: _fastapi.Request, exmode : Union[str, None] = _fastapi.Cookie(default="all")):
    gene_list = await _services.fetchExGeneList(exmode)
    return templates.TemplateResponse('display_ex_home.html', context = {'request' : request, 'genes_df' : gene_list})

# Search CS excluded results
@app.post("/csexc")
async def ex_main_search(request: _fastapi.Request, search_string : str = _fastapi.Form(), exmode : Union[str, None] = _fastapi.Cookie(default="all")):
    gene_list = await _services.fetchExGeneList(exmode)

    if search_string:
        gene_list = gene_list[gene_list["gene_names"].str.contains(search_string, case=False)]

    return templates.TemplateResponse('display_ex_home.html', context = {'request' : request, 'genes_df' : gene_list})

# CS excluded (reset route)
@app.get("/csexc/reset")
async def ex_main_reset(request: _fastapi.Request, exmode : Union[str, None] = _fastapi.Cookie(default="all")):
    response = RedirectResponse("/csexc")
    response.set_cookie(key="exmode", value="all")
    return response

# CS excluded (deseq2 only route)
@app.get("/csexc/deseq2")
async def ex_main_deseq2(request: _fastapi.Request, exmode : Union[str, None] = _fastapi.Cookie(default="all")):
    response = RedirectResponse("/csexc")
    response.set_cookie(key="exmode", value="deseq2")
    return response

# CS excluded (wilcox only route)
@app.get("/csexc/wilcox")
async def ex_main_wilcox(request: _fastapi.Request, exmode : Union[str, None] = _fastapi.Cookie(default="all")):
    response = RedirectResponse("/csexc")
    response.set_cookie(key="exmode", value="wilcox")
    return response

# CS included results page
@app.get("/csinc")
async def main_page(request: _fastapi.Request):
    gene_list = await _services.fetchGeneList()
    return templates.TemplateResponse('display_home.html', context = {'request' : request, 'genes_df' : gene_list})

# CS included results page search function
@app.post("/csinc")
async def search_main(request: _fastapi.Request, search_string : str = _fastapi.Form()):

    gene_list = await _services.fetchGeneList()

    if search_string:
        gene_list = gene_list[gene_list["gene_names"].str.contains(search_string, case=False)]

    return templates.TemplateResponse('display_home.html', context = {'request' : request, 'genes_df' : gene_list})

# For count barplots
@app.get("/csinc/plots/barplot/{gene_id}/")
async def bar_plot(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsPlot(counts_dict, gene_id)

    return templates.TemplateResponse(gene_id + "_counts_log1p" + ".html", context={'request' : request})

# For count boxplots
@app.get("/csinc/plots/boxplot/{gene_id}/")
async def box_plot(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsBoxPlot(counts_dict, gene_id)

    return templates.TemplateResponse(gene_id + "_counts_boxplot_log1p" + ".html", context={'request' : request})

# For intra-sample variance
@app.get("/csinc/plots/intravar/{gene_id}/")
async def intravar_box_plot(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsIntraVariancePlot(gene_id)

    return templates.TemplateResponse(gene_id + "_counts_intravar_box_log1p" + ".html", context={'request' : request})

# For intra-sample variance non-zero filtered
@app.get("/csinc/plots/intravarnz/{gene_id}/")
async def intravar_box_plot(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsIntraVariancePlot(gene_id, zero_filt=True)

    return templates.TemplateResponse(gene_id + "_counts_intravar_box_log1p" + ".html", context={'request' : request})

