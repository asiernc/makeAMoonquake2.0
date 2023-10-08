import React, {Component} from "react";
import Plotter from "./Plotter";

class InfoPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {  

        }

    }
    render() { 

        return ( 
            <div className="InfoPanel">
                <p>Data library</p>
                <Plotter />
            </div>
        );
    }
}

export default InfoPanel;