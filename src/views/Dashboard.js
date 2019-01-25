import React, { Component } from 'react'
import './css/dashboard.css'
import SideNavBarSearchInput from './SideNavBarSearchInput'
import MapWithLocation from './MapWithLocation'
import ListBox from './ListBox'

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
      type: 'A'},
    markers: [],
    selectedPlace: {},
    showingInfoWindow: false,
    activeMarker: {}
  }
  componentDidMount() {
    this.getGeoLocation()
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };
  onMarkerClickFromList = (e) => {
    let plzid = e.target.getAttribute('data-place-id')
    let currentMkr = null
    for(let obj of this.state.markers) {
      if (obj.identifier === plzid) {
        currentMkr = obj
      }
    }
    this.setState({
      selectedPlace: currentMkr,
      activeMarker: currentMkr,
      showingInfoWindow: true
    });
  }
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMarkerMounted  = (element) => {
    if (element !== null)
    this.setState(prevState => ({
      markers: [...prevState.markers, element.marker]
    }))
}

  updateMap = obj => {
    this.setState({requestOptions: obj})
    this.searchNearby(obj)
    document.getElementById('menuicon').click()
  }

  onMapReady = (mapProps, map) => {
    this.setState({
      map: map,
      mapProps: mapProps
    })
    this.searchNearby(this.state.requestOptions)
  }

  
  searchNearby = (requestOptions) => {
    const { google } = this.state.mapProps;

    const service = new google.maps.places.PlacesService(this.state.map);

    // Specify location, radius and place types for your Places API search.
    const request = {
      location: this.state.userLocation,
      radius: requestOptions.range,
      type: requestOptions.type
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
       this.setState({ places: tempArr, markers: [] });
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
          <nav className="navbar navbar-dark bg-dark">
            <button id="menuicon" className="navbar-toggler d-block d-md-none" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <h1 className="text-danger">My NeighborHood</h1>
          </nav>
        <div className="d-flex d-flex-row">
          <div  className="collapse dont-collapse-sm col-md-4 col-sm-12 px-2"  id="navbarToggleExternalContent" >
           <SideNavBarSearchInput userLocation={userLocation}  updateMap={this.updateMap.bind(this)}></SideNavBarSearchInput>
           <ListBox places={this.state.places} invokerMarker={this.onMarkerClickFromList.bind(this)}></ListBox>
           </div>
          <div  className="col map-container">
            <MapWithLocation places={this.state.places}
            onMarkerMounted={this.onMarkerMounted}
            userLocation={userLocation} mapReady={this.onMapReady.bind(this)}
            onMarkerClick={this.onMarkerClick.bind(this)}
            onMapClicked={this.onMapClicked.bind(this)}
            showingInfoWindow={this.state.showingInfoWindow}
            selectedPlace={this.state.selectedPlace}
            activeMarker={this.state.activeMarker}></MapWithLocation>
          </div>
        </div>        
      </main>
    )
  }
}

export default Dashboard;