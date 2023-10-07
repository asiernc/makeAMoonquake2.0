import { Component } from "react";
import './MenuInteraction.css';
import './App.css';

class OtherMaps extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    // function to extends the slider
    toggleSliderMaps = () => {
        console.log('hola')
        this.setState({showSliderMaps: !this.state.showSliderMaps})
        if (!this.state.showSliderMaps) {
            this.props.switchMap('moon')
        }
        this.showLegend(undefined)
    }

    // function to show the legend
    showLegend = async (value) => {
        if(value === 'topo') {
            this.setState({ showTopoLegend: !this.state.showTopoLegend, showFeOLegend: false});
        } else if (value === 'feo') {
            this.setState({ showFeOLegend: !this.state.showFeOLegend, showTopoLegend: false})
        } else if(value === undefined) {
            this.setState({ showTopoLegend: false, showFeOLegend: false });
        }
    }

    render() { 
        return ( 
            <>
            <div className='container-otherMaps'>
                <button onClick={() => {this.toggleSliderMaps()}}>Other Maps</button>
                    {this.state.showSliderMaps && (
                        <div className='otherMaps'>
                            <button onClick={async () => {
                            this.props.switchMap('moon')
                            }}
                            style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0
                        }}
                        >
                            <img height="38" width="48" src={'icon-moon.jpeg'} alt="icon-topo"/>
                        </button>
                        <button onClick={async () => {
                            this.props.switchMap('topoMap')
                            this.showLegend('topo')
                            }}
                            style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0
                        }}
                        >
                            <img height="38" width="48" src={'icon-topo.png'} alt="icon-topo"/>
                        </button>
                        <button onClick={async () => {
                            this.props.switchMap('feoMap')
                            this.showLegend('feo')
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: 0
                            }}
                        >
                            <img height="38" width="48" src={'icon-FeO.jpeg'} alt="icon-FeO"/>
                        </button>
                    </div>
                )}
                <div className={this.state.showTopoLegend ? 'legend-container' : 'legend-hidden'}>
                    <img src={'legend-topo.png'} alt='legend-topo' />
                </div>
                <div className={this.state.showFeOLegend ? 'legend-container' : 'legend-hidden'}>
                    <img src={'legend-FeO.jpg'} alt='legend-FeO'/>
                </div>
                </div>
            </>
        );
    }
}

export default OtherMaps;