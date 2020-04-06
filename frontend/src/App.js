import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
// import Dashboard from './Components/Dashboard/Dashboard';
// import LandingPage from './Components/LandingPage/LandingPage'
import Next from './pages/Next'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            {/* <Route path="/" exact component = { Dashboard }/>
            <Route path="/login" exact component = { LandingPage }/> */}
            <Route exact path="/next">
              <Next />
            </Route>
            {/* <Route path="*" exact component = { Dashboard }/> */}
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
