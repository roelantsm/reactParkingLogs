import React, { Component } from 'react'
// import {Link} from 'react-router-dom'
import { Table } from 'react-bootstrap';
// import { setTimeout } from 'timers'

import { NavLink } from 'react-router-dom'; 
import '../../App.css';


export default class Home extends Component {


    state = {
        ws: null,
        parkeerplaatsen: {

            KontichVrij: "",
            KontichBezet: "",
            KontichTotal:"",
            
            BrusselVrij: "",
            BrusselBezet: "",
            BrusselTotal:"",

            AntwerpenVrij: "",
            AntwerpenhBezet: "",
            AntwerpenTotal:""
        }
    }

    constructor(props) {
         super(props);
         console.log(this.props.ws);
    }


    componentDidMount() {
        this.setState({
            parkeerplaatsen: this.props.parkeerplaatsen
          });
      }

      componentWillReceiveProps(props) {
        this.setState({ parkeerplaatsen: props.parkeerplaatsen })
      }

    render() {
        return (

        <div>


        <h1>Overzicht</h1>     

            <Table  striped bordered hover>
                <tbody>
                <tr>
                    <th>parkeerplaats</th>
                    <th>beschikbaar</th>
                    <th>bezet</th>
                    <th>totaal</th>
                    <td></td>
                </tr>

                <tr>
                    <td>Kontich</td>

                    <td>{this.state.parkeerplaatsen.KontichVrij}</td>
                    <td>{this.state.parkeerplaatsen.KontichBezet}</td>
                    <td>{this.state.parkeerplaatsen.KontichTotal}</td>
                    <td>{this.state.parkeerplaatsen ? <NavLink to="/detail/Kontich">detailpage</NavLink> : ""} </td>
                </tr>

                <tr>
                    <td>Antwerpen</td>
                    
                    <td>{this.state.parkeerplaatsen.AntwerpenVrij}</td>
                    <td>{this.state.parkeerplaatsen.AntwerpenBezet}</td>
                    <td>{this.state.parkeerplaatsen.AntwerpenTotal}</td>
                    <td>{this.state.parkeerplaatsen ? <NavLink to="/detail/Antwerpen">detailpage</NavLink> : ""} </td>
                </tr>

                <tr>
                    <td>Brussel</td>
                    
                    <td>{this.state.parkeerplaatsen.BrusselVrij}</td>
                    <td>{this.state.parkeerplaatsen.BrusselBezet}</td>
                    <td>{this.state.parkeerplaatsen.BrusselTotal}</td>
                    <td>{this.state.parkeerplaatsen ? <NavLink to="/detail/Brussel">detailpage</NavLink> : ""} </td>
                </tr>
                </tbody>
            </Table >
        </div>
        )
    }
}
    