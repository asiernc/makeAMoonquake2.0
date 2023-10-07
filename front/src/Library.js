import { Component } from "react";
import axios from 'axios';

class Library extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
        }
    }

    getPlot = async () => {
        const body = {
            'date': new String('1971-4-17'),
            'spacecraft': new String('12')
        };
        const url = 'http://localhost:8000/get_plots'
        await axios.post(url, body, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}}, {headers:{'Content-Type': 'image/png'}})
            .then(async (response) => {
                const binary = response.data;
                await this.setState({data: `data:image/png;base64,${binary}`})
                console.log(this.state.data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    render() { 
        const {data} = this.state
        return ( 
        <div>
            <button onClick={()=>this.getPlot()}>get data</button>
            <img src={data} alt={'png'}></img>
        </div> );
    }
}
 
export default Library;