import React, { Component } from 'react'
// import {Link} from 'react-router-dom'
// import { setTimeout } from 'timers'

// import { NavLink } from 'react-router-dom'; 
import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';


export default class Events extends Component {


    state = {
        ws: null,
        events: 
        [
          
        ],
        chosenFilter: 'all'
    }

    constructor(props) {
         super(props);
         console.log(this.props.ws);
    }


    componentDidMount() {
        this.setState({
            events: this.props.events,
            chosenFilter: 'all'
          });
      }

      componentWillReceiveProps(props) {
        this.setState({ events: props.events })
      }


      activateFilter(severity) {
        console.log(severity);
        this.setState({
            chosenFilter: severity
          });
      }



      showSeverity = (severity) => {

        console.log(severity);

        var color = "green";
        if ( severity ===  'low') {
            color = "green";
        }

        if ( severity ===  'middle') {
            color = "orange";
        }

        if ( severity ===  'high') {
            color = "red";
        }

        // let newStyle = {
        //     fontWeight: 'bold'
        // }

        return (<li> severity: <div style={{color:color }}> {severity} </div></li>);
      };




    render() {
        return (

        <div>
            <h1 style={{
                backgroundColor: "#999",
                fontSize: 54
            }}
            >Events</h1>     

        <Button onClick={() => this.activateFilter('low')} variant="outline-success">low</Button>{' '}
        <Button onClick={() => this.activateFilter('middle')} variant="outline-warning">middle</Button>{' '}
        <Button onClick={() => this.activateFilter('high')} variant="outline-danger">high</Button>{' '}
        <Button onClick={() => this.activateFilter('all')} variant="outline-info">all</Button>{' '}


            <div>
            {

            this.state.chosenFilter !==  'all'? 
                (!this.state.events)? null: this.state.events.filter(x => x.severity === this.state.chosenFilter).map((event, index)=> {
                    return <div key={event.uuid}>
                        <div>

                            <h3>{index +1})    {event.uuid}</h3>

                            <ul>
                                <li>message:  {event.body} </li>
                                                  
                                {this.showSeverity(event.severity)}

                                <li>timestamp:  {event.timestamp} </li>
                                <li>event:  {event.type} </li>
                            </ul>
                        </div>
                        <br/>
                    </div>
                }) :  (!this.state.events)? null: this.state.events.map((event, index)=> {
                    return <div key={event.uuid}>
                        <div>

                            <h3>{index +1})    {event.uuid}</h3>

                            <ul>
                                <li>message:  {event.body} </li>

                                {this.showSeverity(event.severity)}

                                <li>timestamp:  {event.timestamp} </li>
                                <li>event:  {event.type} </li>
                            </ul>
                        </div>
                        <br/>
                    </div>
                })
            }

            </div>
        </div>
        )
    }
}
    