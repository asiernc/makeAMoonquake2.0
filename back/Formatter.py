import requests
from datetime import datetime, timedelta
import os
import csv
import json
class Formatter():

    def __init__(self):
        # pds-geosciences.wustl.edu - /lunar/urn-nasa-pds-apollo_seismic_event_catalog/data/ # CSV  
        self._quakes_url = "https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_seismic_event_catalog/data"
        # pds-geosciences.wustl.edu - /lunar/urn-nasa-pds-apollo_pse/data/xa/continuous_waveform/ # MSEED
        self._mseed_url = "https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_pse/data/xa/continuous_waveform"
        self._resource_dir = "resources"

    # Private function to download file from url to resource directory
    async def _download_file(self, url, destination):
        response = await requests.get(url)
        with open(destination, 'wb') as file:
            file.write(response.content)

    # Function that returns a list of available mseed files for a given spacecraft day month and year
    async def get_mseed(self, day, month, year, spacecraft):
        if not os.path.exists(self._resource_dir):
            os.makedirs(self._resource_dir)

        parsed_day = datetime.strptime(f'{day}/{month}', "%d/%m").timetuple().tm_yday
        num_day = str(parsed_day).zfill(3)
        url = f'{self._mseed_url}/{spacecraft}/{year}/{num_day}'

        filenames = []

        for i, t in enumerate(['mh1', 'mh2', 'mhz']):
            filename = f'xa.{spacecraft}.00.{t}.{year}.{num_day}.0.mseed'
            try:
                await self._download_file(f'{url}/{filename}', f'{self._resource_dir}/{filename}')
            except Exception as e:
                return [e]
        
        return filenames
    
    # Function that returns True if quakes.csv is downloaded and saved as json file succesfully
    async def fetch_quakes_data(self):
        url = f'{self._quakes_url}/nakamura_1979_sm_locations.csv'
        try:
            response = await requests.get(url)
            if response.status_code == 200:
                csv_content = response.content.decode('utf-8')
                csv_data = []
                csv_reader = csv.DictReader(csv_content.splitlines())
                for row in csv_reader:
                    csv_data.append(row)
                
                with open(f'{self._resource_dir}/quakes.json', 'w') as json_file:
                    json.dump(csv_data, json_file, indent=4)
                
                print(f"CSV file downloaded and converted to JSON in '{json_file}'")
            else:
                return False

        except Exception as e:
                return False
        
    def filter_quakes_data(self):
        data = []
        with open(f'{self._resource_dir}/quakes.json') as json_file:
            quakes_data = json.load(json_file)

        for quake in quakes_data:
            date = datetime(int(quake['Year']), 1, 1) + timedelta(int(quake['Day']) - 1)
            obj = {
                'lat': quake['Lat'],
                'lng':  quake['Long'],
                'magn':  quake['Magnitude'],
                'date': {
                    'day':  date.day,
                    'month': date.month,
                    'year': date.year,
                }
            }
            data.append(obj)
        return data
