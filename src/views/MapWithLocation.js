import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import './css/mapwithlocation.css'

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapWithLocation extends Component {
  static propTypes = {
    userLocation: PropTypes.object,
    mapReady: PropTypes.func.isRequired,
    places: PropTypes.array
  }
  state = {
    zoom: 15,
    loading: true,
    selectedPlace: {},
    showingInfoWindow: false,
    activeMarker: {}
  }
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });


  render() {
    let zoom = this.state.zoom
    let userLocation = this.props.userLocation
    let nearByPlaces = this.props.places
    console.log(nearByPlaces)
    return (
      <Map google={this.props.google} zoom={zoom}
        style={mapStyles}
        onReady={this.props.mapReady}
        onClick={this.onMapClicked}
        initialCenter={userLocation}> 
         <Marker
            title={ 'Your Location' }
            name={ 'Your Location' }
            position={ userLocation }
            icon={{
              url: '/user-pin.png',
            }}          
          />
         {
              nearByPlaces.map((plz)=> (
                <Marker
                    key={plz.placeid}
                    title={ plz.name }
                    name={ plz.name }
                    position={ plz.position }
                    address = { plz.address}
                    photoUrl = { plz.photoUrl }
                    onClick={this.onMarkerClick}
                  >
                  </Marker>
              ))
            }
          <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div className="d-flex flex-row bd-highlight m-3 markerwindow">
              <img className='mapimg' src={this.state.selectedPlace.photoUrl} alt={this.state.selectedPlace.name}/>
              <div className="px-2"><h5>{this.state.selectedPlace.name}</h5>
              <p>{this.state.selectedPlace.address}</p></div>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_API_KEY)
})(MapWithLocation)