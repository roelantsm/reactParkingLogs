import React, { Component } from 'react'
// import {Link} from 'react-router-dom'
// import { setTimeout } from 'timers'


export default class Home extends Component {


    constructor(props) {
        super(props);

        this.state = {
            ws: null
        };
    }

    // single websocket instance for the own application and constantly trying to reconnect.

    componentDidMount() {
        this.connect();
    }

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
            this.state.ws.send({
                "action": "getParkingSpots", 
                "data": ""
            }) //send data to the server
        } catch (error) {
            console.log(error) // catch error
        }
    }

    render() {
        return (
            <div>
                <div id="dashboardContainer"></div>
                <div id="loadedContainer"></div>
                <div id="errorContainer"></div>

                <button onClick={this.handleClick}>Click Me</button>
            </div>
            )
        }
    }
    