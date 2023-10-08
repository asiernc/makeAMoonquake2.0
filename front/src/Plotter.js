import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

class Plotter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frames: [],
      animationInterval: 1000,
      currentFrame: 0,
    };
  }

  componentDidMount = async () => {
    await this.setState({plotLayout: {
        showlegend: false,
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
        data: []
    }})
    const body = {
        'date': new String('1971-4-17'),
        'spacecraft': new String('12')
    };
    const url = 'http://localhost:8000/get_plots'
    await axios.post(url, body, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then((response) => {
            if (response.status !== 200) {
                throw new Error('Request failed with status ' + response.status);
            }
            return response.data;
        })
        .then(async (csvData) => {
            const lines = csvData.split('\n');
            let x = [];
            let y = [];
            let dataset = []
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(',');
                if (parts.length === 2) {
                    x = parts[0] // "1971-04-17 00:00:00.349000"
                    y = parts[1] // "521\r"
                    if (y == -1) y = ''
                }
                dataset.push({x:x, y:y});
            }
            console.log(dataset)
            await this.setState({data: dataset, dataSaved: true})
        })
        .catch((error) => {
            console.error('Error:', error);
        });
  }

  render() {
    const { dataSaved, data, plotLayout } = this.state;
    return (
    <>
        {dataSaved? 
        <>
            <div className="PlotContainer">
                Ploted .mseed data from Apollo Seismic Waveform Data from NASA’s Planetary Data System (PDS).
                
                <div className='Plot'><Plot
                    data = {[{
                        x: data.map((item) => new Date(item.x)),
                        y: data.map((item) => item.y),
                    }]}
                    layout={plotLayout}
                    config={{ displayModeBar: false }}
                /></div>
            </div>
        </>:
            <><div className="PlotContainer">
            Wait please. Loading data...
        </div></>}
    </>
    );
  }
}

export default Plotter;
