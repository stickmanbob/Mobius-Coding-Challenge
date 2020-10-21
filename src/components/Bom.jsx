import React from 'react';
import bomData from '../mock_bom_data.json';

export default class BomView extends React.Component {

    constructor(props){
        super(props);

        this.state={
            dataFetched: false,

        }
    }

    handleChange(idx,field){
        return (e) =>{
            e.preventDefault();
            
            let newBomData = Array.from(this.state.bomData);

            newBomData[idx].fields[field] = e.target.value;

            this.setState({
                bomData: newBomData
            })
            console.log(this.state)
        }
    }

    componentDidMount(){
        fetch('https://www.mobiusmaterials.com/api/v1/bom/1001/',{
            method: 'GET',
            mode: 'no-cors' // Allow the API call to go through
        }) // Fetch API always resolves .then calls, so this will still work
            .then((res) => this.setState({
                bomData: bomData,
                dataFetched: true
            }))
        console.log(bomData)
    }

    renderRows(){

        const rows = this.state.bomData.map((part,i) => {
            let { quantity, specific_part, item_unit_cost} = part.fields;

            return (
                <tr key={i}>
                    <td>{specific_part}</td>
                    <td><input type="number" step="0.01" min="0" value={this.state.bomData[i].fields.item_unit_cost} onChange={this.handleChange(i, "item_unit_cost")} /></td>
                    <td>
                        <input type="number" min="0" value={this.state.bomData[i].fields.quantity} onChange={this.handleChange(i,"quantity")}/>
                    </td>
                </tr>
            )
        })

        return rows; 
    }

    render(){

        if(!this.state.dataFetched) return null; 

        return(
            <section id="BomView">
                <h1>Bill of Materials</h1>

                <table className="bom-table">
                    <thead>
                        <tr>
                            <th>Part Number</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                        </tr>  
                    </thead>

                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </section>
        )
    }
}