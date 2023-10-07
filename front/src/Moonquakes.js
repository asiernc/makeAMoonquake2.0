import { Component } from "react";

class Moonquakes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSlider: false,
            year: 1971,
            magnitude: 0,
            allYears: false,
            allMagnitudes: false,
        }
        
    }
    // function to extends the slider
    toggleSlider = () => { 
        this.setState({showSlider: !this.state.showSlider}) 
    }

    handleYearChange = (event) => {
        const selectedYear = event.target.value
        this.setState({year: selectedYear})
    }

    handleCheckboxYears = () => {
        const { allYears } = this.state;
        this.setState({allYears: !allYears})
    }
    
    handleMagnitudeChange = (event) => {
        const selectedMagnitude = event.target.value
        this.setState({magnitude: selectedMagnitude})
    }

    handleCheckboxMagn = () => {
        const { allMagnitudes } = this.state;
        this.setState({allMagnitudes: !allMagnitudes})
    }

    render() { 
        const {year, allYears, magnitude, allMagnitudes} = this.state
        return ( 
            <>
                <div className="slider">
                    <button onClick={this.toggleSlider}>Moonquakes</button>
                </div>
                {this.state.showSlider &&  (
                    <div className="control-container">
                        <div className="range-buttons">
                            <label htmlFor="yearRange">Year selected: {year} </label>
                            <input 
                                type="range" 
                                min="1971" 
                                max="1976" 
                                step="1"
                                value={year}
                                disabled={allYears}
                                onChange={this.handleYearChange}
                            />
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={allYears} 
                                    onChange={this.handleCheckboxYears}
                                />
                                All
                            </label>
                        </div>

                        <div className="range-buttons">
                            <label htmlFor="magnRange">Magn selected: {magnitude}</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="5" 
                                step="0.5"
                                value={magnitude} 
                                disabled={allMagnitudes}
                                onChange={this.handleMagnitudeChange}
                            />
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={allMagnitudes} 
                                    onChange={this.handleCheckboxMagn}
                                />
                                All
                            </label>
                        </div>
                        <div className="control-buttons">
                            <button onClick={() => {this.props.setFilterMoonquakes(year, allYears, magnitude, allMagnitudes)}}>Filter</button>
                            <button onClick={() => {this.props.setFilterMoonquakes({magnitude: 0})}}>Clear</button>
                        </div>
                    </div>


                )}  
            
            </>
        );
    }
}

export default Moonquakes;