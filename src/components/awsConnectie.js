import React, { Component } from 'react'
//var QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");
var AWS = require('aws-sdk');

const sts = new AWS.STS();



global.fetch = require('node-fetch')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export default class awsConnectie extends Component {

    

render() {

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
                        if (err.statusCode == 409) {
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
                {autehnticateUser()}
            </div>
        )
    }
}
