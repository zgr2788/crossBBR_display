import services as _services
import fastapi as _fastapi
import fastapi.templating as _templates
import fastapi.staticfiles as _StaticFiles
import jinja2 as _jinja2
import os

app = _fastapi.FastAPI()
app.mount("/static", _StaticFiles.StaticFiles(directory="Static"), name="Static")
templates = _templates.Jinja2Templates(directory = "Templates")


# Main page
@app.get("/")
async def main_page(request: _fastapi.Request):
    
    # TODO: Implement string search for gene symbols
    gene_list = await _services.fetchGeneList()
    return templates.TemplateResponse('display_home.html', context = {'request' : request, 'genes_df' : gene_list})

# Main page search function
@app.post("/")
async def main_page(request: _fastapi.Request, search_string : str = _fastapi.Form()):

    gene_list = await _services.fetchGeneList()

    if search_string:
        gene_list = gene_list[gene_list["gene_names"].str.contains(search_string, case=False)]

    return templates.TemplateResponse('display_home.html', context = {'request' : request, 'genes_df' : gene_list})

@app.get("/barplot/{gene_id}")
async def main_page(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    # TODO: Implement scaling change
    await _services.fetchCountsPlot(counts_dict, gene_id, "log1p")

    return templates.TemplateResponse(gene_id + "_counts_" + "log1p" + ".html", context={'request' : request})


@app.get("/boxplot/{gene_id}")
async def main_page(request: _fastapi.Request, gene_id: str):
    counts_dict, gene_id = await _services.fetchCounts(gene_id)
    
    # TODO: Implement scaling change
    await _services.fetchCountsBoxPlot(counts_dict, gene_id, "log1p")

    return templates.TemplateResponse(gene_id + "_counts_boxplot_" + "log1p" + ".html", context={'request' : request})

"""
try:
    service = sys.argv[1]
    gene_id = sys.argv[2]
    scale_type = sys.argv[3]
except:
    print("Insufficient args")
    sys.exit()



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
"""