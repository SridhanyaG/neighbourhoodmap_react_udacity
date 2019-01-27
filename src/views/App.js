import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Dashboard from './Dashboard'

class App extends Component {
  componentDidMount() {
    window.gm_authFailure = this.gm_authFailure
  }
  gm_authFailure() { 
    alert("Map loading failed because of Api key or Quota exceeded. Please fix it before proceeding futher")
  }
  render() {
    return (
      <div className="container">
      <Switch>
        <Route exact path='/' render={() => (
          <Dashboard
          />
        )}/>
      </Switch>
      </div>
    )
  }
}

export default App;