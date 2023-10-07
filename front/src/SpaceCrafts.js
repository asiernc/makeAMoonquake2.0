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
                                onChange={(e) => this.setState({year: e.target.value})}
                                disabled={allSpacecrafts}
                            />
                        <label>
                            <input 
                                type="checkbox" 
                                checked={allSpacecrafts} 
                                onChange={(e) => this.setState({allSpacecrafts: e.target.checked})}
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