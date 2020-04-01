import React, { Component } from 'react'
// import {Link} from 'react-router-dom'
// import { setTimeout } from 'timers'

import { NavLink } from 'react-router-dom'; 


export default class Home extends Component {


    state = {
        ws: null,
        parkeerplaatsen: {

            KontichVrij: null,
            KontichBezet: null,
            KontichTotal:null,
            
            BrusselVrij: null,
            BrusselBezet: null,
            BrusselTotal:null,

            AntwerpenVrij: null,
            AntwerpenhBezet: null,
            AntwerpenTotal:null
        }
    }

    // constructor(props) {
    //     super(props);

    //    //  this.state = {
    //     //     ws: null,
    //     //     parkeerplaatsen:null,
    //     //     test: null


    //     // };
    // }

    // single websocket instance for the own application and constantly trying to reconnect.

    componentDidMount() {
        this.connect();
    }


    updateOverzichtAlles = (incObject) => {
        console.log("A");
        console.log(incObject);
        delete incObject.message;


    //    this.state.parkeerplaatsen = incObject;

        var newObject  = {...this.state.parkeerplaatsen};
        newObject.KontichVrij = incObject.KontichVrij;
        newObject.KontichBezet = incObject.KontichBezet;
        newObject.KontichTotal = incObject.KontichTotal;

        newObject.BrusselVrij = incObject.BrusselVrij;
        newObject.BrusselBezet = incObject.BrusselBezet;
        newObject.BrusselTotal = incObject.BrusselTotal;

        newObject.AntwerpenVrij = incObject.AntwerpenVrij;
        newObject.AntwerpenBezet = incObject.AntwerpenBezet;
        newObject.AntwerpenTotal = incObject.AntwerpenTotal;

        this.setState({
            parkeerplaatsen: newObject
          });
    };


    timeout = 250; // Initial timeout duration as a class variable

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    connect = () => {
        var ws = new WebSocket("wss://mgp8do7hd9.execute-api.eu-west-1.amazonaws.com/v5");
        let that = this; // cache the this
        var connectInterval;

        // websocket onopen event listener
        ws.onopen = () => {
            console.log("connected websocket main component");

            this.setState({ ws: ws });

            that.timeout = 250; // reset timer to 250 on open of websocket connection 
            clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };



        

        ws.onmessage = evt => {
            // listen to data sent from the websocket server
            //const message = JSON.parse(evt.data)
            console.log(evt.data)

            var incObject = null;
            incObject = JSON.parse(evt.data);

            if(incObject != null) {
                switch(incObject.message) {
                    case "":
                    // code block
                    break;
                    case "overzichtAlles":
                        this.updateOverzichtAlles(incObject);
                    break;
                    default:
                    // code block 
                }
            }
        };




        // websocket onclose event listener
        ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        };

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };
    };

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };




    handleClick=()=>{
    //    const {websocket} = this.props // websocket instance passed as props to the child component.
        console.log("clicked");
        try {

            var formatMessage = {
                "action": "getParkingSpots", 
                "data": "AA"
            };

            this.state.ws.send(formatMessage); //send data to the server
        } catch (error) {
            console.log(error) // catch error
        }
    }

    render() {
        return (
            <div>
            {/* //     <div id="dashboardContainer"></div>
            //     <div id="loadedContainer"></div>
            //     <div id="errorContainer"></div> */}

            <h1>Overzicht</h1>

            

            <table>
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
                    <td>{this.state.parkeerplaatsen.KontichVrij ? <NavLink to="/detail/Kontich">detailpage</NavLink> : null} </td>
                </tr>

                <tr>
                    <td>Antwerpen</td>
                    
                    <td>{this.state.parkeerplaatsen.AntwerpenVrij}</td>
                    <td>{this.state.parkeerplaatsen.AntwerpenBezet}</td>
                    <td>{this.state.parkeerplaatsen.AntwerpenTotal}</td>
                    <td>{this.state.parkeerplaatsen.AntwerpenVrij ? <NavLink to="/detail/Antwerpen">detailpage</NavLink> : null} </td>
                </tr>

                <tr>
                    <td>Brussel</td>
                    
                    <td>{this.state.parkeerplaatsen.BrusselVrij}</td>
                    <td>{this.state.parkeerplaatsen.BrusselBezet}</td>
                    <td>{this.state.parkeerplaatsen.BrusselTotal}</td>
                    <td>{this.state.parkeerplaatsen.BrusselVrij ? <NavLink to="/detail/Brussel">detailpage</NavLink> : null} </td>
                </tr>
                </tbody>
            </table>

                <button onClick={this.handleClick}>Click Me</button>
            </div>
            )
        }
    }
    