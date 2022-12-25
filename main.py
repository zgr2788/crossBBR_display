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


@app.get("/barplot/{gene_id}/{norm}")
async def bar_plot(request: _fastapi.Request, gene_id: str, norm : str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsPlot(counts_dict, gene_id, norm)

    return templates.TemplateResponse(gene_id + "_counts_" + norm + ".html", context={'request' : request})

@app.get("/boxplot/{gene_id}/{norm}")
async def box_plot(request: _fastapi.Request, gene_id: str, norm : str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    await _services.fetchCountsBoxPlot(counts_dict, gene_id, norm)

    return templates.TemplateResponse(gene_id + "_counts_boxplot_" + norm + ".html", context={'request' : request})