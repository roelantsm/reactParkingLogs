import React, { Component } from 'react'
import $ from 'jquery';
import axios from 'axios';
var QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");
var AWS = require('aws-sdk');
var QuickSightEmbedding2 = require('./../libs/quicksight-2018-04-01.min.json')

const sts = new AWS.STS();


global.fetch = require('node-fetch')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export default class awsConnectie extends Component {



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
                height: "1500px"
            };
            var dashboard = QuickSightEmbedding.embedDashboard(params);
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

    componentDidMount= () =>  {

      //  const script = document.createElement("script");
      //  script.src = "https://quicksightembwebapp-thebucket-fw4llqam7or4.s3.amazonaws.com/amazon-cognito-identity.min.js";
      //  script.async = true;
        
       // document.body.appendChild(script);

        console.log("hello");

        var awsData = {
            cognitoAuthenticatedUserName:'samuel',
            cognitoAuthenticatedUserPassword:'manageMANAGE33@',
            dashboardId: '8cae0751-cf0c-4c7d-ac41-fe03c4a49936',
            region:'eu-west-1',
            cognitoIdentityPoolId:'eu-west-1:43556396-48ea-4df7-b073-e46e8f8d6c7d',
            cognitoAuthenticatedUserPoolId:'eu-west-1_Z4bkJQ9Df',
            cognitoAuthenticatedClientId:'48ol84t87autg6tg9i8c2j0iko',
            roleSessionName: 'sessionName24',
            apiGatewayUrl:'https://c0ul325g0f.execute-api.eu-west-1.amazonaws.com/prod/getdashboardembedurl?',
            cognitoAuthenticatedLogins: 'cognito-idp.eu-west-1.amazonaws.com/eu-west-1_Z4bkJQ9Df'
        }

        this.embedDashboardCognitoAuthenticated(awsData);
    
        
    }
    




render() {

    const embedDashboardCognitoAuthenticated = (awsData) =>  {
        console.log("hi");
    }

    


    // TO DO
    const quicksightUrl = () =>  {

        console.log("hello");

        var params = {
            //DurationSeconds: 3600,
            //ExternalId: "123ABC",
            RoleArn: "arn:aws:iam::550242960653:role/Cognito_quicksightReadersAuth_Role",
            RoleSessionName: "michielReader"
        };
        var sts = new AWS.STS({
            apiVersion: '2011-06-15'
        });


        sts.assumeRole(params, function (err, data) {
            if (err) console.log("Assumwe erri :::::::::::::::::: ", err, err.stack);
            else {
                var params = {
                    AwsAccountId: '550242960653',
                    Email: 'michieltestingadapter@gmail.com',
                    IdentityType: 'IAM', //| QUICKSIGHT, /* required */
                    Namespace: 'default',
                    UserRole: 'READER', //ADMIN | AUTHOR | READER | RESTRICTED_AUTHOR | RESTRICTED_READER, /* required */
                    IamArn: 'arn:aws:iam::550242960653:role/Cognito_quicksightReadersAuth_Role',
                    SessionName: 'michielReader',
                };


                AWS.config.update({
                    accessKeyId: data.Credentials.AccessKeyId,
                    secretAccessKey: data.Credentials.SecretAccessKey,
                    sessionToken: data.Credentials.SessionToken,
                    "region": "eu-west-1"
                });

                var quicksight = new AWS.Service({
                    apiConfig: require('./../libs/quicksight-2018-04-01.min.json'),
                    region: 'eu-west-1',
                });

                quicksight.registerUser(params, function (err, data1) {
                    if (err) {
                        console.log(":::::::::::::::::::::::");
                        console.log(JSON.stringify(err));
                        if (err.statusCode === 409) {
                            // console.log("Register User :::::::::::::::: ", data1);
                            quicksight.getDashboardEmbedUrl({
                                    AwsAccountId:"550242960653",
                                    DashboardId: "7159b851-5055-4c5e-9eb9-3e695334cf2e",
                                    IdentityType: "IAM",
                                    ResetDisabled: true,
                                    SessionLifetimeInMinutes: 400,
                                    UndoRedoDisabled: false
                                },
                                function (err, data) {
                                    if (!err) {
                                        console.log(Date());

                                        //callback(data);
                                    } else {
                                        console.log(err);

                                        //callback();
                                    }
                                }
                            );

                        }
                        console.log("err register user ::::::::::::::::::", err, err.stack);
                    } // an error occurred

                    else {
                        // console.log("Register User :::::::::::::::: ", data1);
                        quicksight.getDashboardEmbedUrl({
                            AwsAccountId: "550242960653",
                            DashboardId: "7159b851-5055-4c5e-9eb9-3e695334cf2e",
                            IdentityType: "IAM",
                            ResetDisabled: true,
                            SessionLifetimeInMinutes: 400,
                            UndoRedoDisabled: false
                        },
                        function (err, data) {
                            if (!err) {
                                console.log(Date());
                                // callback(data);
                            } else {
                                console.log(err);
                                // callback();
                            }
                        }
                    );
                }
            });



                /////////////////////////////////////


                // var params = {
                //     AwsAccountId: '550242960653',
                //     Email: 'michieltestingadapter@gmail.com',
                //     IdentityType: 'IAM', //| QUICKSIGHT, /* required */
                //     Namespace: 'default',
                //     UserRole: 'READER', //ADMIN | AUTHOR | READER | RESTRICTED_AUTHOR | RESTRICTED_READER, /* required */
                //     IamArn: 'arn:aws:iam::550242960653:role/Cognito_quicksightReadersAuth_Role',
                //     //IamArn: 'arn:aws:iam::550242960653:role/QuicksightEmbed',
                //     SessionName: "michielNode",
                // };




                // quicksight.getDashboardEmbedUrl({
                //     AwsAccountId: "550242960653",
                //     DashboardId: "7159b851-5055-4c5e-9eb9-3e695334cf2e",
                //     IdentityType: "IAM",
                //     ResetDisabled: true,
                //     SessionLifetimeInMinutes: 400,
                //     UndoRedoDisabled: false
                // },
                //     function (err, data) {
                //         if (!err) {
                //             console.log(Date());
                //             console.log(data);
                //             //callback(data);
                //         } else {
                //             console.log(err);
                //             //callback();
                //         }
                //     }
                // );



            }
        });
    }






    const autehnticateUser = () =>  {

        var authenticationData = {
            Username: 'michielReader',
            Password: 'St9zp7wr40@',
        };
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
            authenticationData
        );
        
        var poolData = {
            UserPoolId: 'eu-west-1_GSraaQczW', // Your user pool id here
            ClientId: '5fcrcsmjubgj0mj1vu649o7cv8', // Your client id here
        };
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var userData = {
            Username: 'michielReader',
            Pool: userPool,
        };
        
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        
        

        cognitoUser.authenticateUser(authenticationDetails, {

                

                onSuccess: function(result) {
        
                var accessToken = result.getAccessToken().getJwtToken();
                console.log(accessToken);
        
                AWS.config.region = 'eu-west-1';
        
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'eu-west-1:fc807ce7-380b-4387-b02b-35bc05e08c8a', // your identity pool id here
                    Logins: {
                        // Change the key below according to the specific region your user pool is in.
                        'cognito-idp.eu-west-1.amazonaws.com/eu-west-1_GSraaQczW': result
                            .getIdToken()
                            .getJwtToken(),
                    },
                });
        
                //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
                AWS.config.credentials.refresh(error => {
                    if (error) {
                        console.error(error);
                    } else {
                        // Instantiate aws sdk service objects now that the credentials have been updated.
                        // example: var s3 = new AWS.S3();


                        quicksightUrl();
                        console.log('Successfully logged!');
                    }
                });
            },
        
            onFailure: function(err) {
                alert(err.message || JSON.stringify(err));
            },
        });
    };

        return (
            <div>
                
                    <div id="dashboardContainer"></div>
                    <div id="loadedContainer"></div>
                    <div id="errorContainer"></div>
            </div>
        )
    }
}
