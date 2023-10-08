import React, {Component} from "react";
import Plotter from "./Plotter";
import './infopanel.css'

class InfoPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {  

        }

    }
    render() { 
        const {data} = this.props;
        return ( 
            <div className="InfoPanel">
                <div className="Title"><h2>Data library</h2></div>
                <div className="Data">
                    <Plotter/>
                </div>
                
            </div>
        );
    }
}

export default InfoPanel;