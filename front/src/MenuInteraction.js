import { Component } from "react";
import './MenuInteraction.css';
import axios from 'axios';
import SpaceCrafts from "./SpaceCrafts";
import Moonquakes from "./Moonquakes";
import OtherMaps from "./OtherMaps";
import OtherControls from './OtherControls.js'
import InfoPanel from './InfoPanel'
class MenuInteraction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfoPanel: false,
        }
    }

    // function to send of props the data from the filter
    setFilterSpacecraft = async (year, allSpacecrafts) => {
        console.log(year)
        // clear the globe
        if (!year) {
            this.setState({ 
                globeOptions: {
                    pointsData: undefined,
                    pointLabel: undefined
                }
            });
        }
        // get the data from the API
            const response = await axios.get('http://localhost:8000/get_spacecrafts');
            const data = response.data; // Aquí obtienes los datos de la API
            console.log(data); // Agrega esta línea para verificar los datos
        
            let filteredData;
            if (allSpacecrafts) {
                filteredData = data;
            } else {
                console.log(year, data)
                filteredData = data.filter((spacecraft) => {
                return spacecraft.launchDate.year == year;
                });
            }
            console.log(filteredData);
            const pointLabel = (point) => {
            return `
                <div style="background-color: '#41505b9d';
                    width: 150%;"
                    font-size: 15px;">
                Name: ${point.name}
                Lat: ${point.lat}
                Lng: ${point.lng}
                Launch Date: ${point.launchDate.year + '-' + point.launchDate.month + '-' + point.launchDate.day}
                `;
            };
            this.props.saveFilteredData(filteredData, pointLabel, undefined, undefined);
        
    }

        setFilterMoonquakes = async (year, allYears, magnitude, allMagnitudes) => {
            // clear the globe
            if (!magnitude) {
                this.setState({ 
                    globeOptions: {
                        ringsData: undefined
                    }
                });
            }
            // get the data from the API
            await axios.get('http://localhost:8000/get_moonquakes')
                .then((response) => {
                    let filteredData = response.data;
                    console.log(response.data)
                    // filter by year
                        if(!allYears) {
                            filteredData = filteredData.filter((moonquake) => {
                                return moonquake.date.year == year
                            });
                        }
                    // filter by magnitude
                        if(!allMagnitudes ) {
                            filteredData = filteredData.filter((moonquake) => {
                                return moonquake.magn <= magnitude
                            });
                        }
                    // filter by moonquake and add new properties
                    filteredData = filteredData.map((moonquake) => ({
                        ...moonquake,
                        maxR: moonquake.magn * 5,
                        propSpeed: (moonquake.magn * 1.5),
                        repeatPeriod: (500 + ( - moonquake.magn * 10)),
                        ringColor: 'red',
                    }));

                    let pointsData = []
                    filteredData.map((ring) => {
                        const point = {
                            lat: ring.lat,
                            lng: ring.lng,
                        }
                        pointsData.push(point);
                    })

                    const onPointClick = async (point, event, { lat, lng, altitude }) => {
                        console.log(point)
                        await this.setState({showInfoPanel: true, selectedInfoPanel: {'lat': lat, 'lng': lng}})
                    }
        
                    this.props.saveFilteredData(pointsData, undefined, onPointClick, filteredData)
            })
        }
        
    render() { 
        const {selectedInfoPanel, showInfoPanel} = this.state
        return ( 
        <>
            <div className="topPanel">
                <button onClick={() => this.props.changeUI(0)}
                style={{marginBottom:'5%', width:'40%', height:'7%'}}>
                    BACK
                </button>
                <div className="component">
                    <SpaceCrafts setFilterSpacecraft={this.setFilterSpacecraft}/>
                </div>
                <div className="component">
                    <Moonquakes setFilterMoonquakes={this.setFilterMoonquakes}/>
                </div>
            </div>
            <OtherMaps
                topographicMapEnabled={this.setTopographicMap}
                FeOMapEnabled={this.setFeOMap}
                switchMap = {this.props.switchMap}
            />
            <OtherControls
                initialPosition={this.props.initialPosition}
                autoMov={this.props.autoMov}
            />
            {showInfoPanel?
                <InfoPanel
                    data={selectedInfoPanel}            
                />
                :
                <></>
            }
        </> 
        );
    }
}

export default MenuInteraction;