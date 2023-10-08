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
      data: []
    };
  }

  componentDidMount = async () => {
    await this.setState({plotLayout: {
        showlegend: false,
        width: 850,
        height: 500,
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
    }})
    await this.fetchData();
  }

  fetchData = async () => {
    const {data} = this.state;
    const body = {
        'date': new String('1973-2-11'),
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
            console.log(lines.length)
            let x = [];
            let y = [];
        
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(',');
                if (parts.length === 2) {
                    x = parts[0] // "1971-04-17 00:00:00.349000"
                    y = parts[1] == -1 ? NaN : parts[1] // "521\r"
                }
                data.push({x:x, y:y});
            }
            await this.setState({data: data, dataSaved: true})
        })
        .catch((error) => {
            console.error('Error:', error);
        });
  }

  render() {
    const { dataSaved, frames, data, plotLayout } = this.state;
    return (<>
        {
        dataSaved?
            <div className='PlotPanel'>
                <Plot
                    data={[{
                        x: data.map((item) => new Date(item.x)),
                        y: data.map((item) => item.y),
                    }]} 
                    layout={plotLayout}
                    frames={frames}
                    config={{ displayModeBar: false }}
                />
            </div>:
            <></>
        }   
    </>
    );
  }
}

export default Plotter;
