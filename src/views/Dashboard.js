import React, { Component } from 'react'
import './css/dashboard.css'
import SideNavBarSearchInput from './SideNavBarSearchInput'
import MapWithLocation from './MapWithLocation'

class Dashboard extends Component {
  render() {
    return (
      <main className="container-fluid">
        <nav className="map-nav-bar">
          <a href="/">My Neighborhood</a>
        </nav>
        <div className="d-flex d-flex-row">
          <SideNavBarSearchInput className="col-md-4"></SideNavBarSearchInput>
          <div  className="col-md-8 map-container">
            <MapWithLocation></MapWithLocation>
          </div>
        </div>        
      </main>
    )
  }
}

export default Dashboard;