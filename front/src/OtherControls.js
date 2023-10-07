import { Component } from "react";

class OtherControls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoMov: false
        }
    }

    moveGlobeToInitialPosition = () => {
        this.props.initialPosition.current.pointOfView({
            lat: 0,
            lng: 0,
            altitude: 2.5,
        }, 2000);
    }

    handleSubmitAutoMov = async () => {
        console.log('Automov')
        await this.setState({autoMov: !this.state.autoMov})
        if(this.state.autoMov) {
                this.props.autoMov.current.controls().autoRotate = true;
                this.props.autoMov.current.controls().autoRotateSpeed = 1;
            } else {
                this.props.autoMov.current.controls().autoRotate = false;
            }
    }

    render() { 
        return ( 
        <>
        <div className='otherControls'>
                    <button onClick={() => this.handleSubmitAutoMov()}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        margin: '2%'
                }}
                >
                    <img height="30" width="30" src={'autoMov.png'} alt="auto-movement"/>
                </button>
                <button onClick={this.moveGlobeToInitialPosition}
                    style={{
                    background: 'transparent',
                    border: 'none',
                    marginTop: '5%'
                }}>
                    <img height="30" width="30" src={'location.png'} alt="location"/>
                </button>
                </div>
        </>
        );
    }
}

export default OtherControls;