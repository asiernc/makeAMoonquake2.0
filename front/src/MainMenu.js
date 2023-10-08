import React, { Component } from 'react';
import './MainMenu.css'

class MainMenu extends Component {
    constructor(props) {
        super(props);
    }
    render() { 
        return ( 
            <>
                <div className='MainMenu'>
                    {/* four buttons for the first menu, demo, interaction, library, github function switch value*/}
                    <button onClick={() => this.props.changeUI(1)}>TOUR</button>
                    <button onClick={() => this.props.changeUI(2)}>INTERACTION</button>
                    <button onClick={this.props.doGit}>DOCUMENTATION</button>
                    <button onClick={()=>this.props.test()}>TEST BUTTON</button>
                </div>
            </>
        );
    }
}

export default MainMenu;