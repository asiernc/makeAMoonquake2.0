import { Component } from "react";
import './MenuInteraction.css';
import axios from 'axios';
import SpaceCrafts from "./SpaceCrafts";
import Moonquakes from "./Moonquakes";
import OtherMaps from "./OtherMaps";
import OtherControls from './OtherControls.js'

class MenuInteraction extends Component {
    constructor(props) {
        super(props);
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
        await axios.get('http://localhost:8000/get_spacecrafts')
            .then((response) => {
            let filteredData;
            if(allSpacecrafts){
                filteredData = response.data
            } else {
                console.log(response.data)
                filteredData = response.data.filter((spacecraft) => {
                    return spacecraft.launchDate.year === year
                })
            }

            const pointLabel = (point) => {
                return `
                    <div style="background-color: '#41505b9d';
                        width: 150%;"
                        font-size:15px>
                    Name: ${point.name}
                    Lat: ${point.lat}
                    Lng: ${point.lng}
                    Launch Date: ${point.launchDate.year + '-' + point.launchDate.month + '-' + point.launchDate.day}
                `
            }
            
            this.props.saveFilteredData(filteredData, pointLabel, undefined)
            })
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
                                return moonquake.date.year === year
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
                
            this.props.saveFilteredData(undefined, undefined, filteredData)
            })
        }
        
    render() { 
        return ( 
        <>
            <div className="topPanel">
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
        </> 
        );
    }
}

export default MenuInteraction;