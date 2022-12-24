import services as _services
import fastapi as _fastapi
import fastapi.templating as _templates
import fastapi.staticfiles as _StaticFiles
import jinja2 as _jinja2

app = _fastapi.FastAPI()
app.mount("/static", _StaticFiles.StaticFiles(directory="Static"), name="Static")
templates = _templates.Jinja2Templates(directory = "Templates")


# Main page
@app.get("/")
async def main_page(request: _fastapi.Request):
    gene_list = await _services.fetchGeneList()
    return templates.TemplateResponse('display_home.html', context = {'request' : request, 'genes_df' : gene_list})

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