import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Dashboard from './Components/Dashboard/Dashboard';
import LandingPage from './Components/LandingPage/LandingPage'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component = { LandingPage }/>
            <Route path="/dashboard" exact component = { Dashboard }/>
            <Route path="*" exact component = { LandingPage }/>
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
