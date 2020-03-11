import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


import AwsConnectie from './components/hulpfuncties/awsConnectie';
import Navbar from './components/Navbar';




import Home from './components/Pages/Home'
import Billing from './components/Pages/Billing'
import Post from './components/Pages/Post'
import DetailPage from './components/Pages/DetailPage';




function App() {
  return (
    <div className="App">



      <BrowserRouter>
          <div>
            <Navbar />
            <Switch>
              <Route path="/"  exact component={Home} exact />
              <Route path="/billing" exact component={Billing} />
              <Route path="/post" exact  component={Post} />
              <Route path="/post/:post_id" exact component={DetailPage} />
              <Route render={() => <div>404</div>} />
            </Switch>
          </div>
        </BrowserRouter>
        
          {/* <AwsConnectie /> */}
    </div>
  );
}

export default App;
