import React from 'react';
import bomData from '../mock_bom_data.json';

export default class BomView extends React.Component {

    constructor(props){
        super(props);

        this.state={
            dataFetched: false,
        }

        this.modifiedItems = new Set();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this); 
    }

    
    componentDidMount(){
        fetch(`https://www.mobiusmaterials.com/api/v1/bom/${this.props.bomId}/`,{
            method: 'GET',
            mode: 'no-cors' // Allow the API call to go through
        }) // Fetch API always resolves .then calls, so this will still work
        .then((res) => {
            
            let newBomData = {};

            bomData.forEach( item => newBomData[item.pk] = item );
            
            this.setState({
                bomData: newBomData,
                dataFetched: true
            })
            
        })
    }
    
    handleChange(pk,field){
        return (e) =>{
            e.preventDefault();
            
            let newBomData = Object.assign(this.state.bomData);

            newBomData[pk].fields[field] = Number(e.target.value);

            this.modifiedItems.add(pk);

            this.setState({

                bomData: newBomData,
            })
            
        }
    }

    async handleSubmit(){

        this.setState({
            dataFetched: false
        }, async () => {

                const newItems = [];
                const newBomData = Object.assign(this.state.bomData);
                const modifiedItems = Array.from(this.modifiedItems);

                for (let i = 0; i < modifiedItems.length; i++) {

                    let itemId = modifiedItems[i];

                    const res = await fetch(`https://www.mobiusmaterials.com/api/v1/bom/${this.props.bomId}/bomitem/${itemId}`,
                        {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.state.bomData[itemId])
                        });

                    // if(res.ok) newItems.push(res.json().data)  // If we were actually making a request. Would also add a conditional to handle failed requests
                    newItems.push(this.state.bomData[itemId]) // - Mocking a successful save

                }

                console.log(newItems); // See changes 

                newItems.forEach(item => newBomData[item.pk] = item);

                this.setState({
                    bomData: newBomData,
                    dataFetched: true
                });
        })
        
    }

    renderRows(){

        const bomItems = Object.values(this.state.bomData)

        bomItems.sort((a,b) => a.fields.specific_part - b.fields.specific_part)
        console.log(bomItems)
        const rows = bomItems.map((part,i) => {
            let {  specific_part } = part.fields;

            return (
                <tr key={i}>
                    <td>{specific_part}</td>
                    <td><input type="number" step="0.01" min="0" value={this.state.bomData[part.pk].fields.item_unit_cost} onChange={this.handleChange(part.pk, "item_unit_cost")} /></td>
                    <td>
                        <input type="number" min="0" value={this.state.bomData[part.pk].fields.quantity} onChange={this.handleChange(part.pk,"quantity")}/>
                    </td>
                </tr>
            )
        })

        return rows; 
    }

    render(){

        if (!this.state.dataFetched) return <div className="lds-dual-ring"></div>;

        return(
            <section id="BomView">
                <h1>Bill of Materials {this.props.bomId}</h1>

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

                <button onClick={this.handleSubmit}>Save Changes</button>
            </section>
        )
    }
}