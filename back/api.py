from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn 
from Formatter import Formatter
from Plotter import Plotter
from starlette.responses import Response
from datetime import datetime
import base64

# API CONFIG
app = FastAPI()
origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ENDPOINTS #

# Main endpoint
@app.get("/")
async def main():
    return {"message": "Hello NASA we ara here!"}

# get_moonquakes endpoint return a list of quakes
@app.get("/get_moonquakes")
def get_moonquakes():
    formatter = Formatter()
    formatter.fetch_quakes_data()
    return formatter.filter_quakes_data()

# get_spacecrafts endpoint return a list of spacecrafts
@app.get("/get_spacecrafts")
def get_spacecrafts():
    formatter = Formatter()
    data = formatter.fetch_quakes_data()
    return data

# get_demo endpoint return two list of datasets
@app.get("/get_demo")
def get_demo():
    spacecrafts = get_spacecrafts()
    quakes = get_moonquakes()
    return [{'spacecrafts': spacecrafts}, {'quakes': quakes}]

# get_plots endpoint return a plot object in binray format (image/png)
@app.post("/get_plots")
async def get_plots(date: str = Form(...), spacecraft: str = Form(...)):
    formatter = Formatter()
    plotter = Plotter()
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    mseed_files = await formatter.get_mseed(date_obj.day, date_obj.month, date_obj.year,f's{spacecraft}')
    if (not mseed_files):
        return {"message": "No data provided"}
    try:
        plot = plotter.do_plot(mseed_files)
        try:
            if(base64.b64encode(base64.b64decode(plot))) == plot:
                print('Base 64 encoded')
            else:
                print('Not base64 encoded')
        except Exception:
            print(' Invalid format')

        return Response(content=plot, media_type="image/png")
    except Exception as e:
        return Response(content=str(e), status_code=500)

# test endpoint return a bool if test passed successfully
@app.get("/test")
def test():
    return True


# API INIT
if __name__ == "__main__":
    uvicorn.run('api:app', port=8000, reload=True)