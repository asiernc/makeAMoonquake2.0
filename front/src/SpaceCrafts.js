import { Component } from "react";
import './MenuInteraction.css';

class SpaceCrafts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSlider: false,
            year: 1969,
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

    handleCheckbox = () => {
        const {allSpacecrafts} = this.state;
        this.setState({allSpacecrafts: !allSpacecrafts})
    }

    render() {
        const {year, allSpacecrafts} = this.state

        return ( 
        <> 
            <div className="slider">
                    <button onClick={this.toggleSlider}>Spacecraft</button>
            </div>
            {this.state.showSlider &&  (
                <div className="control-container">
                        <div className="range-buttons">
                            <label htmlFor="yearRange">Year selected:{year}</label>
                            <input 
                                type="range" 
                                min="1969" 
                                max="1972" 
                                value={year} 
                                onChange={this.handleYearChange}
                                disabled={allSpacecrafts}
                            />
                        <label>
                            <input 
                                type="checkbox" 
                                checked={allSpacecrafts} 
                                onChange={this.handleCheckbox}
                            />
                            All
                        </label>
                        </div>
                    <div className="control-buttons">
                        <button onClick={() => {this.props.setFilterSpacecraft(year, allSpacecrafts)}}>Filter</button>
                        <button onClick={() => {this.props.setFilterSpacecraft({year: 0})}}>Clear</button>
                    </div>
                </div>

            )}
                
        </> 
        );
    }
}

export default SpaceCrafts;