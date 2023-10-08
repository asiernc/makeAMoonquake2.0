from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn 
from Formatter import Formatter
from datetime import datetime
import pandas as pd

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
    return {'spacecrafts': spacecrafts, 'quakes': quakes}

# get_plots endpoint return a plot object in binray format (image/png)
@app.post("/get_plots")
async def get_plots(date: str = Form(...), spacecraft: str = Form(...)):
    formatter = Formatter()
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    # OBTENER DATOS ON LINE
    # mseed_files = await formatter.get_mseed(date_obj.day, date_obj.month, date_obj.year,f's{spacecraft}')
    mseed_file = formatter.get_mseed_test(date_obj.day, date_obj.month, date_obj.year,f's{spacecraft}')
    if (not mseed_file):
        return {"message": "No data provided"}
    file = formatter.get_plot_data(mseed_file)
    try:
        response = FileResponse(file, media_type="text/csv")
        response.headers["Content-Disposition"] = "attachment; filename=downloaded_file.csv"
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# test endpoint return a bool if test passed successfully
@app.get("/test")
def test():
    return True


# API INIT
if __name__ == "__main__":
    uvicorn.run('api:app', port=8000, reload=True)