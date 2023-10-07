import React, { Component } from 'react'
import Globe from 'react-globe.gl'
import './App.css';
import MenuInteraction from './MenuInteraction.js'
import Library from './Library.js'
import MainMenu from './MainMenu.js'


class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
          globeOptions: {
            bumpImageUrl:"moon16.jpg",
            globeImageUrl: "8k_moon.jpg",
            showAtmosphere: true,
            atmosphereColor: 'white',
            atmosphereAltitude: 0.1,
            backgroundImageUrl: '8k_stars_milky_way.jpg',
          },
          ui: undefined
      }

      this.UIs = [
        <MainMenu
          changeUI={this.changeUI}
          />, 

          <></>,

        <MenuInteraction
          saveFilteredData={this.saveFilteredData}
        />, 

        <Library 
        
        />, 
      
      ]
  }
  componentDidMount = () => this.setState({ui : this.UIs[0]})
  
  // change for switch function, 
  changeUI = (index) => {
    if(index===1)
      {this.doDemo()};

    this.setState({ui: this.UIs[index]})}
  
  // Open Github 
  doGit = () => window.open('urlgithub') 

  doDemo = () => {}


  // function to save the data from the filter
  saveFilteredData = (pointsData, pointLabel, ringsData) => {
    this.setState({
      globeOptions: {
        pointsData: pointsData,
        pointLabel: pointLabel,
        ringsData: ringsData,
        
        ringMaxRadius: 'maxR',
        ringPropagationSpeed: 'propSpeed',
        ringRepeatPeriod: 'repeatPeriod',
        ringColor: 'ringColor',
        ringLabel: 'ringLabel',
      }
    })
  }

  render () {
    const { ui, globeOptions } = this.state
    return (
      <>
        <div className="Screen">
          {ui}
        </div>
        <div className='Globe'>
          <Globe {...globeOptions}/>
        </div>
      </>
    );
}
}

export default App;





/* componentDidMount = () => this.setState({ui : this.mainMenu}) */
