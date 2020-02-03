import React from 'react';
import logo from './logo.svg';
import './App.css';

var QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");
var AWS = require('aws-sdk');




this.getQuickSightUrl = function (idToken, username, callback) {
  //  console.log('Token '+ idToken);
  AWS.config.region = 'eu-west-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "eu-west-1:602564b4-157a-42c8-ab6b-1a013c6e47d7",
      Logins: {
          'cognito-idp.eu-west-1.amazonaws.com/eu-west-1_1RAHNSJCq': idToken
      }
  });



  var params = {
      //DurationSeconds: 3600,
      //ExternalId: "123ABC",
      RoleArn: "arn:aws:iam::550242960653:role/Cognito_quicksightMRIdentityPoolUnauth_Role",
      RoleSessionName: username
  };
  var sts = new AWS.STS({
      apiVersion: '2011-06-15'
  });
  sts.assumeRole(params, function (err, data) {
      if (err) console.log("Assumwe erri :::::::::::::::::: ", err, err.stack); // an error occurred
      else {
          var params = {
              AwsAccountId: '550242960653',
              Email: 'michiel.roelants@student.ehb.be',
              IdentityType: 'IAM', //| QUICKSIGHT, /* required */
              Namespace: 'default',
              UserRole: 'READER', //ADMIN | AUTHOR | READER | RESTRICTED_AUTHOR | RESTRICTED_READER, /* required */
              IamArn: 'arn:aws:iam::550242960653:role/Cognito_quicksightMRIdentityPoolUnauth_Role',
              SessionName: username,
          };
          AWS.config.update({

              accessKeyId: data.Credentials.AccessKeyId,
              secretAccessKey: data.Credentials.SecretAccessKey,
              sessionToken: data.Credentials.SessionToken,
              "region": 'eu-west-1'
          });
          var quicksight = new AWS.Service({

              apiConfig: require("../quicksightconfig.json"),
              region: "us-east-1"
          });
          quicksight.registerUser(params, function (err, data1) {
              if (err) {
                  console.log(":::::::::::::::::::::::");
                  console.log(JSON.stringify(err));
                  if (err.statusCode == 409) {
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
                                  callback(data);
                              } else {
                                  console.log(err);
                                  callback();
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
                              callback(data);
                          } else {
                              console.log(err);
                              callback();
                          }
                      }
                  );
              }
          });
      }
  });
}



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit3 <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
