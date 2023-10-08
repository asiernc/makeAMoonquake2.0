import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

class Plotter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frames: [],
      animationInterval: 1000, // in milliseconds
      currentFrame: 0,
    };
  }

  componentDidMount() {
    this.fetchData();
    this.generateFrames();
    this.startAnimation();
  }

  fetchData = async () => {
    const body = {
        'date': new String('1971-4-17'),
        'spacecraft': new String('12')
    };
    const url = 'http://localhost:8000/get_plots'
    await axios.post(url, body, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(async (response) => {
            const data = response.data;
            await this.setState({x: data.x, y: data.y})
        })
        .catch((error) => {
            console.error('Error:', error);
        });
  }

  generateFrames = () => {
    const { x, y } = this.state;
    const frames = [];

    for (let i = 1; i <= x.length; i++) {
      frames.push({
        data: [
          {
            x: x.slice(0, i),
            y: y.slice(0, i),
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'lines',
            line: { color: 'green' },
          },
        ],
        name: `Frame ${i}`,
      });
    }

    this.setState({ frames });
  };

  startAnimation = () => {
    setInterval(() => {
      const { frames, currentFrame } = this.state;
      const nextFrame = (currentFrame + 1) % frames.length;
      this.setState({ currentFrame: nextFrame });
    }, this.state.animationInterval);
  };

  render() {
    const { frames, currentFrame } = this.state;

    return (
      <div>
        <Plot
          data={frames[currentFrame].data}
          layout={{
            title: 'Filled-Area Animation',
            xaxis: {
              title: 'X-Axis',
            },
            yaxis: {
              title: 'Y-Axis',
            },
          }}
          frames={frames}
          config={{ displayModeBar: false }}
        />
      </div>
    );
  }
}

export default Plotter;
