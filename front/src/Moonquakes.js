import { Component } from "react";

class Moonquakes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSlider: false,
            year: 1971,
            magnitude: 0,
        }
        
    }
    // function to extends the slider
    toggleSlider = () => { 
        this.setState({showSlider: !this.state.showSlider}) 
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
                                onChange={(e) => this.setState({year: e.target.value})}
                            />
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={allYears} 
                                    onChange={(e) => this.setState({allYears: e.target.checked})}
                                />
                                All
                            </label>
                        </div>

                        <div className="range-buttons">
                            <label htmlFor="magnRange">Magn selected: {magnitude}</label>
                            <input 
                                type="range" 
                                min="1971" 
                                max="1976" 
                                step="1"
                                value={magnitude} 
                                disabled={allMagnitudes}
                                onChange={(e) => this.setState({year: e.target.value})}
                            />
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={allMagnitudes} 
                                    onChange={(e) => this.setState({allMagnitudes: e.target.checked})}
                                />
                                All
                            </label>
                        </div>
                        <div className="control-buttons">
                            <button onClick={() => {this.props.setFilterMoonquakes(year, allYears, magnitude, allMagnitudes)}}>Filter</button>
                            <button onClick={() => {this.props.setFilterMoonquakes({year: 0})}}>Clear</button>
                        </div>
                    </div>


                )}  
            
            </>
        );
    }
}

export default Moonquakes;