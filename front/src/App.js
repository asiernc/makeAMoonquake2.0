import React, { Component } from 'react'
import Globe from 'react-globe.gl'
import axios from 'axios'
import './App.css';
import MenuInteraction from './MenuInteraction.js'
import MainMenu from './MainMenu.js'


class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
          globeOptions: {
            bumpImageUrl:"moon16.jpg",
            globeImageUrl: "moon.jpeg",
            showAtmosphere: true,
            atmosphereColor: 'white',
            atmosphereAltitude: 0.1,
            backgroundImageUrl: '8k_stars_milky_way.jpg',
          },
          ui: undefined
      }
      this.globeRef = React.createRef(); 

      this.UIs = [
        <MainMenu
          changeUI={this.changeUI}
          doGit={() => this.doGit()}
          />, 

          <></>,
        <MenuInteraction
          changeUI={this.changeUI}
          saveFilteredData={this.saveFilteredData}
          switchMap={this.switchMap}
          initialPosition = {this.globeRef}
          autoMov={this.globeRef}
        />
      ]
  }
  componentDidMount = () => this.setState({ui : this.UIs[0]})
  
  // change for switch function, 
  changeUI = (index) => {
    if(index===1)
      {this.doDemo()};

    this.setState({ui: this.UIs[index]})}
  
  // Open Github 
  doGit = () => {
    window.open('https://github.com/asiernc/makeAMoonquake2.0', "_blank", "noreferrer") 
  }

  // function to show a short preview of the app

  doDemo = async () => {
    const animate = async () => {
      this.globeRef.current.controls().autoRotate = true;
      this.globeRef.current.controls().autoRotateSpeed = 2;
      this.globeRef.current.pointOfView({ altitude: 1.75 }, 1500);
      setTimeout(async () => {
        this.globeRef.current.controls().autoRotate = false;
        this.globeRef.current.controls().autoRotateSpeed = 4;
        this.globeRef.current.controls().autoRotate = true;
        setTimeout(async () => {
          this.globeRef.current.controls().autoRotate = false;
          this.globeRef.current.controls().autoRotateSpeed = 2;
          this.globeRef.current.controls().autoRotate = true;
          setTimeout(async() => { 
            this.globeRef.current.controls().autoRotate = false;
            this.globeRef.current.pointOfView({ altitude: 2.5 }, 1500);
            this.setState({globeOptions:{pointsData: undefined, ringsData: undefined}})
            this.changeUI(0)
          }, 
          7500);
        }, 
        7500);
      },
      7500);
    }

    await axios.get("http://localhost:8000/get_demo")
      .then(async (response) => {
        const {spacecrafts, quakes} = response.data
        console.log(response.data[0])
        await this.setState({globeOptions: {ringsData: quakes, pointsData: spacecrafts}})
        console.log(this.state.globeOptions)
        await animate()
      })
      .catch((error) => {
        console.log(error);
    }); 
  }


  // function to save the data from the filter
  saveFilteredData = (pointsData, pointLabel, onPointClick, ringsData) => {
    this.setState({
      globeOptions: {
        pointsData: pointsData,
        pointLabel: pointLabel,
        ringsData: ringsData,
        onPointClick: onPointClick,
        ringMaxRadius: 'maxR',
        ringPropagationSpeed: 'propSpeed',
        ringRepeatPeriod: 'repeatPeriod',
        ringColor: 'ringColor',
        ringLabel: 'ringLabel',
      }
    })
  }

  // function to switch the globe map
  switchMap = async (value) => {
      await this.setState({
          globeOptions: {
            globeImageUrl: value + '.jpeg',
          }
        })
  }


  render () {
    const { ui, globeOptions } = this.state
    const globeRef = this.globeRef
    return (
      <>
        <div className="Screen">
          {ui}
        </div>
        <div className='Globe'>
          <Globe ref={globeRef} {...globeOptions}/>
        </div>
      </>
    );
}
}

export default App;