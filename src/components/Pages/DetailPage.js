import React, { Component } from 'react'
import {embedDashboardCognitoAuthenticated} from '../hulpfuncties/getDashboard';
// import { NavLink } from 'react-router-dom'; 
import '../../App.css';



import $ from 'jquery';
import axios from 'axios';
var QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");
var AWS = require('aws-sdk');
//var QuickSightEmbedding2 = require('./../libs/quicksight-2018-04-01.min.json')

// const sts = new AWS.STS();


global.fetch = require('node-fetch')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

// const hulpfuncties = require('../hulpfuncties/getParameterDashboard');


export default class DetailPage extends Component {

    state = {
        id: null,
        detailPage: {
            gemeente:"",
            groupId:"",
            huisnr:"",
            latitude:"",
            longitude:"",
            postcode: "",
            straat: "",
            devices:[]
        }
    }


    getParameterValues = (param) => {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0].toLowerCase() === param) {
                return decodeURIComponent(urlparam[1]);
            }
        }
    }

    onVisualLoaded = () => {
        var div = document.getElementById("loadedContainer");
        div.innerHTML = "Dashboard fully loaded";
    }
    
    onError = () => {
        var div = document.getElementById("errorContainer");
        div.innerHTML = "your seesion has expired";
    }


    embedDashboard = (embedUrl) => {
        var containerDiv = document.getElementById("dashboardContainer");
        var params = {
                url: embedUrl,
                container: containerDiv,
                height: "1500px",
                parameters: {
                    groupId: this.state.id                  
                },
            };
            var dashboard = QuickSightEmbedding.embedDashboard(params);
            dashboard.setParameters({groupId: this.state.id});
            dashboard.on('error', this.onError);
            dashboard.on('load', this.onVisualLoaded);
    }


    embedDashboardCognitoAuthenticated = (awsData) => {
        AWS.config.update({ region: awsData.region });

        const cognitoUser = this.getCognitoUser(awsData.cognitoAuthenticatedUserPoolId, awsData.cognitoAuthenticatedClientId, awsData.cognitoAuthenticatedUserName);
        const authenticationDetails = this.getAuthenticationDetails(awsData.cognitoAuthenticatedUserName, awsData.cognitoAuthenticatedUserPassword);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                console.log(result);
                const cognitoIdentity = new AWS.CognitoIdentity();

                const getIdParams = {
                    IdentityPoolId: awsData.cognitoIdentityPoolId,
                    Logins: {[awsData.cognitoAuthenticatedLogins]: result.idToken.jwtToken}
                };

                cognitoIdentity.getId(getIdParams, (err, data) => {
                    if (err) {
                        console.log('Error obtaining Cognito ID.');
                    } else {
                        data.Logins = {[awsData.cognitoAuthenticatedLogins]: result.idToken.jwtToken};

                        cognitoIdentity.getOpenIdToken(data, (err, openIdToken) => {
                            if (err) {
                                console.log('Error obtaining authentication token.');
                            } else {
                                this.apiGatewayGetDashboardEmbedUrl(
                                    awsData.apiGatewayUrl, 
                                    awsData.dashboardId, 
                                    openIdToken.Token, 
                                    true, 
                                    awsData.roleSessionName, 
                                    false, 
                                    false
                                );
                            }
                        });
                    }
                });
            },

            onFailure: function(err) {
                console.log('Error authenticating user.');
            }
        });
    }


    apiGatewayGetDashboardEmbedUrl = (
        apiGatewayUrl, 
        dashboardId, 
        openIdToken, 
        authenticated, 
        sessionName, 
        resetDisabled, 
        undoRedoDisabled
    ) => {
        const parameters = {
            dashboardId: dashboardId,
            openIdToken: openIdToken,
            authenticated: authenticated,
            sessionName: sessionName,
            resetDisabled: resetDisabled,
            undoRedoDisabled: undoRedoDisabled
        }

        const myQueryString = $.param(parameters);
        apiGatewayUrl = apiGatewayUrl + myQueryString;

        const headers = { 'Content-Type' : 'application/json' }

        axios.get(apiGatewayUrl, { headers: headers})
            .then((response) => {
                this.embedDashboard(response.data.EmbedUrl);;
            })
            .catch(function (error) {
                console.log(error);
                console.log('Error obtaining QuickSight dashboard embed url.');
            });
    }


    getCognitoUser = (userPoolId, clientId, userName ) => {
        // Step 1: Get user pool.
        const poolData = {
            UserPoolId: userPoolId,
            ClientId: clientId
        };
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        // Step 2: Get cognito user.
        const userData = {
            Username: userName,
            Pool: userPool
        };
        return new AmazonCognitoIdentity.CognitoUser(userData);
    }
  

    getAuthenticationDetails = (userName, userPassword) => {
        const authenticationData = {
            Username: userName,
            Password: userPassword
        };
        return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    }



    wait = (ms) => {
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
        }
      }



    callProperties = () => {
        console.log('callProperties');

        var test = null;
        test = this.props.ophalenDetailData();
        console.log(test);

        // var test2 = test;

        // if (test.gemeente == "" ) {
        //     console.log("empty");
        // }

        // else {
        //     console.log('test', test2);

        //     test = JSON.parse(test2);
        //     console.log('testParsed', test2);

        //     var test3 =  test.item;
        //     console.log('test2',test3 );

        //     var newObject  = {...test3};
        //     console.log('newObject', newObject);
            
             this.setState({
                 detailPage: test
             });
        // }
      }
    

      componentDidMount(){

        this.props.loadDetaildata();

        let id = this.props.match.params.plaats;
        this.setState({
            id:id
        })

        var awsData = {
            cognitoAuthenticatedUserName:'samuel',
            cognitoAuthenticatedUserPassword:'manageMANAGE33@',
            dashboardId: 'd9741310-7aa4-4371-9e56-95c05ae96c2f',
            region:'eu-west-1',
            cognitoIdentityPoolId:'eu-west-1:43556396-48ea-4df7-b073-e46e8f8d6c7d',
            cognitoAuthenticatedUserPoolId:'eu-west-1_Z4bkJQ9Df',
            cognitoAuthenticatedClientId:'48ol84t87autg6tg9i8c2j0iko',
            roleSessionName: 'sessionName24',
            apiGatewayUrl:'https://c0ul325g0f.execute-api.eu-west-1.amazonaws.com/prod/getdashboardembedurl?',
            cognitoAuthenticatedLogins: 'cognito-idp.eu-west-1.amazonaws.com/eu-west-1_Z4bkJQ9Df'
        }


      //  hulpfuncties.embedDashboardCognitoAuthenticated(awsData);
      //  this.embedDashboardCognitoAuthenticated(awsData);
        embedDashboardCognitoAuthenticated(awsData, id);


        setInterval(() => {
            this.callProperties();
           }, 15000);
    }



    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            console.log("changed pm");
        }
      }
    

    render() {
        return (
            <div>
                DetailPage {this.state.id}


                <div>
                     <h3>gemeente</h3>
                    <p>{this.state.detailPage.gemeente}</p>

                    <h3>groupId</h3>
                    <p>{this.state.detailPage.groupId}</p>

                    <h3>huisnr</h3>
                    <p>{this.state.detailPage.huisnr}</p>

                    <h3>latitude</h3>
                    <p>{this.state.detailPage.latitude}</p>

                    <h3>longitude</h3>
                    <p>{this.state.detailPage.longitude}</p>

                    <h3>postcode</h3>
                    <p>{this.state.detailPage.postcode}</p>

                    <h3>straat</h3>
                    <p>{this.state.detailPage.straat}</p>


                    <h3>devices</h3>

                    {
                        ( !this.state.detailPage.devices.length && !this.state.detailPage.devices.length)? null: this.state.detailPage.devices.map((device, index)=> {

                            return <div key={device.deviceId}>
                                <div>    
                                <ul>
                                        <li>deviceId:  {device.deviceId} </li>
                                        <li>isBezet:  {device.isBezet} </li>
                                    </ul>
                                </div>
                                <br/>
                            </div>
                        })
                    }
                </div>


            <div id="dashboardContainer"></div>
            <div id="loadedContainer"></div>
            <div id="errorContainer"></div>

            </div>
        )
    }
}
