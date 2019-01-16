import React, { Component } from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapWithLocation extends Component {
  state = {
    userLocation: {
      lat: 0,
      lng: 0
    },
    zoom: 13,
    loading: true
  }
  componentDidMount() {
    this.getGeoLocation()
  }

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
    let {userLocation, zoom } = this.state
    return (
      <Map google={this.props.google} zoom={zoom}
        center={userLocation}> 
         <Marker
            title={ 'Your position' }
            name={ 'Your position' }
            position={ userLocation }            
          />
        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{'Hello'}</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_API_KEY)
})(MapWithLocation)