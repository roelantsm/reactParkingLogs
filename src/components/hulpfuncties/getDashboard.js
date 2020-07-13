import $ from 'jquery';
import axios from 'axios';
var QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");
var AWS = require('aws-sdk');

global.fetch = require('node-fetch')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');


export  const getParameterValues = (param) => {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0].toLowerCase() === param) {
            return decodeURIComponent(urlparam[1]);
        }
    }
}

export  const onVisualLoaded = () => {
    var div = document.getElementById("loadedContainer");
    div.innerHTML = "Dashboard fully loaded";
}

export  const onError = () => {
    var div = document.getElementById("errorContainer");
    div.innerHTML = "your seesion has expired";
}


export  const embedDashboard = (embedUrl, id) => {
    var containerDiv = document.getElementById("dashboardContainer");

    var params = {};

    if (id === -1) {
        params.url =  embedUrl;
        params.container =  containerDiv;
        params.height= "1500px";
    }

    else {
        params.url = embedUrl;
        params.container = containerDiv;
        params.height = "1500px";
        params.parameters.groupId = id ;           
    }
    
    var dashboard = QuickSightEmbedding.embedDashboard(params);


    if (id !== -1) {
        dashboard.setParameters({groupId: id});
    }

    dashboard.on('error', onError);
    dashboard.on('load', onVisualLoaded);
}


export  const  embedDashboardCognitoAuthenticated = (awsData, id = -1) => {
    AWS.config.update({ region: awsData.region });

    const cognitoUser = getCognitoUser(awsData.cognitoAuthenticatedUserPoolId, awsData.cognitoAuthenticatedClientId, awsData.cognitoAuthenticatedUserName);
    const authenticationDetails = getAuthenticationDetails(awsData.cognitoAuthenticatedUserName, awsData.cognitoAuthenticatedUserPassword);

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
                            apiGatewayGetDashboardEmbedUrl(
                                awsData.apiGatewayUrl, 
                                awsData.dashboardId, 
                                openIdToken.Token, 
                                true, 
                                awsData.roleSessionName, 
                                false, 
                                false,
                                id
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


export  const apiGatewayGetDashboardEmbedUrl = (
    apiGatewayUrl, 
    dashboardId, 
    openIdToken, 
    authenticated, 
    sessionName, 
    resetDisabled, 
    undoRedoDisabled,
    id
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
            embedDashboard(response.data.EmbedUrl, id);
        })
        .catch(function (error) {
            console.log(error);
            console.log('Error obtaining QuickSight dashboard embed url.');
        });
}


export  const getCognitoUser = (userPoolId, clientId, userName ) => {
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


export  const getAuthenticationDetails = (userName, userPassword) => {
    const authenticationData = {
        Username: userName,
        Password: userPassword
    };
    return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}



//exports.embedDashboardCognitoAuthenticated = embedDashboardCognitoAuthenticated;
