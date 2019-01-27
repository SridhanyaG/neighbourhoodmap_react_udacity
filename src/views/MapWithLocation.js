import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import './css/mapwithlocation.css';
import creditexceeded from '../images/creditexceeded.png';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapWithLocation extends Component {
  static propTypes = {
    userLocation: PropTypes.object,
    mapReady: PropTypes.func.isRequired,
    places: PropTypes.array,
    distance: PropTypes.string,
    onMarkerMounted: PropTypes.func.isRequired,
    selectedPlace: PropTypes.object.isRequired,
    showingInfoWindow: PropTypes.bool.isRequired,
    activeMarker: PropTypes.object.isRequired,
    onMarkerClick: PropTypes.func.isRequired,
    onMapClicked: PropTypes.func.isRequired
  }
  state = {
    zoom: 15,
    loading: true
  }
 
  render() {
    let zoom = this.state.zoom
    let userLocation = this.props.userLocation
    let nearByPlaces = this.props.places
    let img, title // This is patch fix for quota exceeded
    if (this.props.selectedPlace.photoUrl) {
      img = this.props.selectedPlace.photoUrl
      title = this.props.selectedPlace.name
    } else {
      img = creditexceeded
      title = 'Quota exceeded for premium calls in foursquare'
    }
     return (
      <Map google={this.props.google} zoom={zoom}
        style={mapStyles}
        onReady={this.props.mapReady}
        onClick={this.props.onMapClicked}
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
                    identifier={plz.placeid}
                    ref={this.props.onMarkerMounted}
                    key={plz.placeid}
                    title={ plz.name }
                    name={ plz.name }
                    position={ plz.location.labeledLatLngs[0] }
                    address = { plz.location.formattedAddress}
                    onClick={this.props.onMarkerClick}
                  >
                  </Marker>
              ))
            }
          <InfoWindow
          marker={this.props.activeMarker}
          visible={this.props.showingInfoWindow}>
            <div className="d-flex flex-row bd-highlight m-3 markerwindow">
            <img className='mapimg' src={img} title={title} alt={this.props.selectedPlace.name}/>
              <div className="px-2"><h5>{this.props.selectedPlace.name}</h5>
              <p>{this.props.selectedPlace.address}</p>
              <p><em>Distance : </em>{this.props.distance}</p></div>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_API_KEY)
})(MapWithLocation)