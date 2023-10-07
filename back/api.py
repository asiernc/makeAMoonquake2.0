from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn 
from Formatter import Formatter


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
async def get_moonquakes():
    formatter = Formatter()
    formatter.fetch_quakes_data()
    return formatter.filter_quakes_data()

# get_spacecrafts endpoint return a list of spacecrafts
@app.get("/get_spacecrafts")
async def get_spacecrafts():
    return {"message": "sondas"}

# get_demo endpoint return two list of datasets
@app.get("/get_demo")
async def get_demo():
    return {"message": "demo"}

# get_plots endpoint return a plot object in binray format (image/png)
@app.get("/get_plots")
async def get_plots():
    formatter = Formatter()
    mseed_files = formatter.get_mseed(17,4,1971,'s12')
    if (not mseed_files):
        return {"message": "No data provided"}
    plots = []
    return {'message': plots}


# test endpoint return a bool if test passed successfully
@app.get("/test")
async def test():
    formatter = Formatter()
    



# API INIT
if __name__ == "__main__":
    uvicorn.run('api:app', port=8000, reload=True)