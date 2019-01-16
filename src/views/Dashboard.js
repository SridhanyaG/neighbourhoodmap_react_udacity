import React, { Component } from 'react'
import './css/dashboard.css'
import SideNavBarSearchInput from './SideNavBarSearchInput'
import MapWithLocation from './MapWithLocation'

class Dashboard extends Component {
  state ={
    userLocation: {
      lat: 0,
      lng: 0
    },
    places: [],
    map: null,
    mapProps: null,
    requestOptions: {
      range: '500',
      type: 'A'}
  }
  componentDidMount() {
    this.getGeoLocation()
  }

  updateMap = obj => {
    this.setState({requestOptions: obj})
    this.searchNearby()
  }

  onMapReady = (mapProps, map) => {
    this.setState({
      map: map,
      mapProps: mapProps
    })
    this.searchNearby()
  }

  
  searchNearby = () => {
    const { google } = this.state.mapProps;

    const service = new google.maps.places.PlacesService(this.state.map);

    // Specify location, radius and place types for your Places API search.
    const request = {
      location: this.state.userLocation,
      radius: this.state.requestOptions.range,
      type: this.state.requestOptions.type
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        let tempArr = results.map(plzObj =>{ 
          return {placeid: plzObj.place_id, icon: plzObj.icon,
            address: plzObj.vicinity,
            photoIcon: plzObj,
            photoUrl: plzObj.photos ? plzObj.photos[0].getUrl() : plzObj.icon,
            name: plzObj.name, position: {
            lat: plzObj.geometry.location.lat(), lng: plzObj.geometry.location.lng()
          }}
       });
        this.setState({ places: tempArr });
      }
    });
  };

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
              console.log(position.coords);
              this.setState(prevState => ({
                      userLocation: {
                      ...prevState.currentLatLng,
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  },
                  loading: false
              }))
          }
      )
    } else {
        window.console.error("Maps need geolocation api we suggest to google chrome")
    }
  }
  render() {
    let userLocation = this.state.userLocation
    return (
      <main className="container-fluid">
        <nav className="map-nav-bar">
          <a href="/">My Neighborhood</a>
        </nav>
        <div className="d-flex d-flex-row">
          <SideNavBarSearchInput userLocation={userLocation} className="col-md-4" updateMap={this.updateMap}></SideNavBarSearchInput>
          <div  className="col-md-8 map-container">
            <MapWithLocation places={this.state.places} userLocation={userLocation} mapReady={this.onMapReady}></MapWithLocation>
          </div>
        </div>        
      </main>
    )
  }
}

export default Dashboard;