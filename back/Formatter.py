import requests
from datetime import datetime, timedelta
import os
import csv
import json
from obspy import read
import numpy as np

class Formatter():

    def __init__(self):
        # pds-geosciences.wustl.edu - /lunar/urn-nasa-pds-apollo_seismic_event_catalog/data/ # QUAKES CSV  
        self._quakes_url = "https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_seismic_event_catalog/data"
        # https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloland.html # SONDAS DATA
        self._spacecrafts_list = ['s11', 's12', 's14', 's15', 's16', 's17'] 
        # pds-geosciences.wustl.edu - /lunar/urn-nasa-pds-apollo_pse/data/xa/continuous_waveform/ # MSEED
        self._mseed_url = "https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_pse/data/xa/continuous_waveform"
        # Local directory to save formatted resources
        self._resource_dir = "/Volumes/data/resources"

    # Private func that returns formated date for a given default data_set date
    def _format_date(self, date):
        formats = ["%d-%b-%y", "%d %b %Y"]
        for fmt in formats:
            try:
                date_obj = datetime.strptime(date, fmt)
                return {
                    "year": date_obj.year,
                    "month": date_obj.month,
                    "day": date_obj.day
                }
            except ValueError:
                pass
        return None
    
    # Private func that returns formated coordinate for a given default data_set coordinate
    def _format_coords(self, coord):
        pos_coord = ['N', 'E']
        neg_coord = ['S', 'W']
        if(any(char in coord for char in pos_coord)):
            mod_coord = coord.replace('N', '')
            mod_coord = mod_coord.replace('E', '')
            mod_coord = mod_coord.replace(' ', '')
            print(mod_coord)
            return float(mod_coord)
        elif ((any(char in coord for char in neg_coord))):
            mod_coord = coord.replace('S', '')
            mod_coord = mod_coord.replace('W', '')
            mod_coord = mod_coord.replace(' ', '')
            return -float(mod_coord)


    # Private function to download file from url to resource directory
    async def _download_file(self, url, destination):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                with open(destination, 'wb') as file:
                    file.write(response.content)
        except Exception as e:
            print(f"Error: {str(e)}")

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
            filename_saved = f'{spacecraft}-{t}-{year}-{num_day}.mseed'
            try:
                await self._download_file(f'{url}/{filename}', f'{self._resource_dir}/{filename_saved}')
                filenames.append(filename_saved)
            except Exception as e:
                return [e]
        
        return filenames
    
    def get_mseed_test(self, day, month, year, spacecraft):
        if not os.path.exists(self._resource_dir):
            os.makedirs(self._resource_dir)

        parsed_day = datetime.strptime(f'{day}/{month}', "%d/%m").timetuple().tm_yday
        num_day = str(parsed_day).zfill(3)
        filename_saved = f'{spacecraft}-mh1-{year}-{num_day}.mseed'
        return filename_saved

    def get_plot_data (self, file):
        st = read(f'{self._resource_dir}/{file}')
        tr = st[0]
        relative_times = tr.times()
        starttime = tr.stats.starttime
        x = [(starttime + t).datetime for t in relative_times]
        y = tr.data.tolist()
        data = {"x": x, "y": y}
        filename = f'{self._resource_dir}/{file}'.replace('.mseed', '')
        with open(f'{filename}.csv', "w", newline="") as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(["x", "y"])
            for i in range(len(data['x'])):
                if (i%2500==0):
                    csv_writer.writerow([data['x'][i], data['y'][i]])
        return f'{filename}.csv'
    
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
        
    # Function that returns a list of quakes objects
    def filter_quakes_data(self):
        quakes = []
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
            quakes.append(obj)
        print(f'Moonquakes: {quakes}')
        return quakes

    # Function that returns a list of quakes objects
    def fetch_quakes_data(self):
        spacecrafts = []
        with open(f'{self._resource_dir}/spacecrafts.csv', mode="r", newline="") as file:
            csv_reader = csv.DictReader(file, delimiter=";")
            for row in csv_reader:
                obj = {
                    'name': f"Apollo s{row['Mission']}",
                    'lat':  self._format_coords(row['Latitude']),
                    'lng':  self._format_coords(row['Longitude']),
                    'launchDate': self._format_date(row['LaunchDate']),
                    'LandingDate': self._format_date(row['LandingDate']),
                    'LandingSite': row['LandingSite']
                }
                spacecrafts.append(obj)

        print(f'Spacecrafts: {spacecrafts}')
        return spacecrafts