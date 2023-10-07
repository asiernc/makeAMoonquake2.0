import React, {Component} from "react";

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
                <p>Data library</p>
                {data.lat}
                <br></br>
                {data.lng}
            </div>
         );
    }
}
 
export default InfoPanel;