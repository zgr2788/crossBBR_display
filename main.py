import services as _services
import fastapi as _fastapi
import fastapi.templating as _templates
import fastapi.staticfiles as _StaticFiles
from starlette.responses import RedirectResponse
import jinja2 as _jinja2

app = _fastapi.FastAPI()
app.mount("/static", _StaticFiles.StaticFiles(directory="Static"), name="Static")
templates = _templates.Jinja2Templates(directory = "Templates")

# Main page
@app.get("/")
async def main_page(request: _fastapi.Request):
    gene_list = await _services.fetchGeneList()
    return templates.TemplateResponse('display_home.html', context = {'request' : request, 'genes_df' : gene_list})

# Main page search function
@app.post("/")
async def search_main(request: _fastapi.Request, search_string : str = _fastapi.Form()):

    gene_list = await _services.fetchGeneList()

    if search_string:
        gene_list = gene_list[gene_list["gene_names"].str.contains(search_string, case=False)]

    return templates.TemplateResponse('display_home.html', context = {'request' : request, 'genes_df' : gene_list})

# For count barplots
@app.get("/plots/barplot/{gene_id}/")
async def bar_plot(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsPlot(counts_dict, gene_id)

    return templates.TemplateResponse(gene_id + "_counts_log1p" + ".html", context={'request' : request})

# For count boxplots
@app.get("/plots/boxplot/{gene_id}/")
async def box_plot(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsBoxPlot(counts_dict, gene_id)

    return templates.TemplateResponse(gene_id + "_counts_boxplot_log1p" + ".html", context={'request' : request})

# For intra-sample variance
@app.get("/plots/intravarbox/{gene_id}/")
async def intravar_box_plot(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsIntraVariancePlot(gene_id)

    return templates.TemplateResponse(gene_id + "_counts_intravar_box_log1p" + ".html", context={'request' : request})