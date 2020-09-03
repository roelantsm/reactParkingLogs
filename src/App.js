import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// import {Bootstrap, Grid, Row, Col} from 'react-bootstrap';



//import AwsConnectie from './components/hulpfuncties/awsConnectie';
import Navbar from './components/Navbar';

import Home from './components/Pages/Home'
import Billing from './components/Pages/Billing'
// import Post from './components/Pages/Post'
import DetailPage from './components/Pages/DetailPage';
import Overzicht from './components/Pages/Overzicht';

import Events from './components/Pages/Events';



import 'react-notifications/lib/notifications.css';
// import {NotificationContainer, NotificationManager} from 'react-notifications';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import { LinkContainer } from "react-router-bootstrap";


export default class App extends Component {


/*
  STATE
*/

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
      AntwerpenBezet: "",
      AntwerpenTotal:""
  },

  events: 
    [
    //  {id: 10, type: "aangekomen", dateTime: "", message: ""}
    ],


  detailPage: {
    "gemeente":"",
    "postcode":"",
    "groupId":"",
    "longitude":"",
    "huisnr":"",
    "latitude":"",
    "straat":"",
    devices:[]
  }
}

/*
  constructor
*/

  componentDidMount() {
    this.connect();
    // this.getInformation();
    this.loadEvents();
  }



  errorToast = () =>{
    toast.error("an Error occured", {
      className: "custom-toast",
      draggable: true,
      position: toast.POSITION.TOP_RIGHT
    });
  }  
  successToast = () => {
    toast.success("an success occured", {
      className: "custom-toast",
      draggable: true,
      position: toast.POSITION.TOP_RIGHT
    });
  }  
  infoToast = () => {
    toast.info("an info occured", {
      className: "custom-toast",
      draggable: true,
      position: toast.POSITION.TOP_RIGHT
    });
  } 
  warnToast = () => {
    toast.warn("an warn occured", {
      className: "custom-toast",
      draggable: true,
      position: toast.POSITION.TOP_RIGHT
    });
  } 



/*
  afhandellen Receiver functions
*/


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

allEventsOphalen = (incObject) =>{
  console.log("allEventsOphalen");
  console.log(incObject);

  var newArr = [];
  var tempGlobal = "";
  incObject.evenementen.map((event, index) => {
    newArr[index] = event;
    tempGlobal = new Date(parseInt(event.timestamp));


    newArr[index].timestamp = tempGlobal.toISOString(); 
    //date.setTime(inDate.valueOf() - 60000 * inDate.getTimezoneOffset());

    return null;
  });


  console.log(newArr);

  this.setState({
     events: newArr
  });
};
    
  
detailPageAanpassen = (incObject) => {
  
  console.log(incObject);

  var newDetail = {
    "gemeente":incObject.item.gemeente,
    "postcode":incObject.item.postcode,
    "groupId":incObject.item.groupId,
    "longitude":incObject.item.longitude,
    "huisnr":incObject.item.huisnr,
    "latitude":incObject.item.latitude,
    "straat":incObject.item.straat
  }

  var someProperty = incObject.item.devices;



  this.setState({
    detailPage: newDetail
  });



  this.setState(prevState => ({
    ...prevState,
    detailPage : {
      ...prevState.detailPage,
      devices: someProperty
    }
  }));
}


newEven = (incObject) => {

  console.log(incObject);

  var newObj = incObject.event;

  var tempGlobal = new Date(parseInt(newObj.timestamp));

  newObj.timestamp = tempGlobal.toISOString();

  this.setState({
    events: [...this.state.events, newObj]
  });

  //alert(JSON.stringify(newObj));

  if (newObj.severity === "low") {
    toast.success(newObj.body, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  if (newObj.severity === "middle") {
   toast.warn(newObj.body, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
  }

  if (newObj.severity === "high") {

    toast.error(newObj.body, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

};






/*
  websocket
*/ 

  timeout = 250; // Initial timeout duration as a class variable

/**
* @function connect
* This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
*/
connect = () => {
  console.log("inConnect");
  var ws = new WebSocket("wss://mgp8do7hd9.execute-api.eu-west-1.amazonaws.com/v5");
  let that = this; // cache the this
  var connectInterval;

  // websocket onopen event listener
  ws.onopen = () => {
      console.log("connected websocket main component");

      this.setState({ ws: ws });

      that.timeout = 250; // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection

      this.getInformation();
      this.loadEvents();

  };

  ws.onmessage = evt => {
    // listen to data sent from the websocket server
    //const message = JSON.parse(evt.data)
    console.log('inc data ', evt.data)

    var incObject = null;
    incObject = JSON.parse(evt.data);

    console.log('inc message ', incObject.message)

    if(incObject != null) {
      switch(incObject.message) {
        case "updateGege":
          console.log("case: updateGege");
          this.updateOverzichtAlles(incObject);
          break;

        case "overzichtAlles": 
          console.log("case: overzichtAlles");
          this.updateOverzichtAlles(incObject);
          break;

        case "allEventsOphalen": 
          console.log("case: allEventsOphalen");
          this.allEventsOphalen(incObject);       
          break;

        case "ParkingDetail":
          console.log("case: ParkingDetail");
          this.detailPageAanpassen(incObject);
          break;


        case "newEven": 
          console.log("case: newEven");
          this.newEven(incObject);
          break;

        default: 
          console.log("case: default", incObject.message);

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



wait = (ms) => {
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
}


/*
  sender functions
*/

getInformation=() => {
  //    const {websocket} = this.props // websocket instance passed as props to the child component.
  console.log("inGetInformation");
  try {

    var formatMessage = {
      "action": "getParkingSpots2", 
      "data": "AA"
    };

    if( this.state.ws !== null){
      this.state.ws.send(JSON.stringify(formatMessage)); //send data to the server
    }
    else {
      this.connect();
        //this.wait(3000);
        // this.getInformation();
    }
  } catch (error) {
    console.log(error) // catch error
  }
}



loadEvents = () => {
  console.log("in loadEvents");
  try {

      var formatMessage = {
          "action": "getAllNotifications", 
          "data": "AA"
      };

      if( this.state.ws !== null){
          this.state.ws.send(JSON.stringify(formatMessage)); //send data to the server
      }
      else {
          // this.connect();
          // if(this.state.ws !== null){
            this.wait(3000);
          // }
          
          
          // this.getInformation();

      }
  } catch (error) {
      console.log(error) // catch error
  }
};



loadDetaildata = () => {
  console.log("in load Detaildata function");
  console.log(window.location.href);
  console.log(this.props);
  console.log(this.props.location);

  var url = window.location.href;

  var indexLast = url.lastIndexOf('/');
  var plaats = window.location.href.substring(indexLast + 1);
  console.log(plaats);
  
  try {

      var formatMessage = {
          "action": "getOneParkingPlace", 
          "data": `${plaats}`
      };

      if( this.state.ws !== null){
          this.state.ws.send(JSON.stringify(formatMessage)); //send data to the server
      }
      else {
          this.connect();
          //this.wait(3000);
        //  this.loadDetaildata();

      }
  } catch (error) {
      console.log(error) // catch error
  }
}




ophalenDetailData = () => {
  console.log('in ophalenDetailData');
  var jsonToReturnDetailPage = this.state.detailPage;
  console.log('jsonToReturnDetailPage', jsonToReturnDetailPage);

  return jsonToReturnDetailPage;

}

render() {


  // toast.error("an Error occured");


  return (
    <div className="App">

{/* <NotificationContainer/> */}
    <ToastContainer
     position="top-right"
     autoClose={5000}
     hideProgressBar={false}
     newestOnTop={false}
     closeOnClick
     rtl={false}
     pauseOnFocusLoss
     draggable
     pauseOnHover
    />



      <BrowserRouter>
          <div>
            <Navbar />

            
            <div> 
  
            </div>


            <Switch>
              <Route path="/"  exact render={routeProps => <Home {...routeProps} parkeerplaatsen={this.state.parkeerplaatsen} events={this.state.events} />}/>
              <Route path="/overzicht"  exact component={Overzicht} />
              <Route path="/billing" exact component={Billing} />
              <Route path="/events" render={routeProps => <Events {...routeProps} events={this.state.events}/>}/>
            

              {/* <Route path="/detail/:plaats" exact render={(props) => <DetailPage {...props} events={this.state.events} onOpvragen={() => this.loadDetaildata()}/>}/> */}


              <Route path="/detail/:plaats" exact render={(props) => <DetailPage {...props} loadDetaildata={this.loadDetaildata} ophalenDetailData={this.ophalenDetailData}/>}/>

              {/* <Route path="/detail/:plaats" exact render={(props) => <DetailPage {...props} onOpvragen={this.loadDetaildata}/>}/> */}

              {/* Zonder router /> */}
              {/* <Route path="/detail/:plaats" exact component={DetailPage} /> */}
              {/* <Route path="/post" exact  component={Post} /> */}

              <Route render={() => <div>404</div>} />
            </Switch>
          </div>
        </BrowserRouter>
        
          {/* <AwsConnectie /> */}
    </div>
    )
  }
}
    
