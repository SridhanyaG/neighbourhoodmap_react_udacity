import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Dashboard from './Dashboard'

class App extends Component {
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