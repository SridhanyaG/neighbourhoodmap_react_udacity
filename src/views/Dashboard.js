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
    nearBy: '',
    places: [],
    map: null,
    mapProps: null,
    requestOptions: {
      range: '750',
      type: '4bf58dd8d48988d1e0931735' // category coffee shop
    },
    markers: [],
    selectedPlace: {},
    showingInfoWindow: false,
    activeMarker: {},
    placeService: null,
    distance: 'Not Available',
    foursquare: null,
    timezone: '',
    mapError: ''
  }
  // Fetch the Lat Lng of the current user
  componentDidMount() {
    this.getGeoLocation()
    let foursquare = require('react-foursquare')({
      clientID: process.env.REACT_APP_FOURSQUARE_CLIENT_ID,
      clientSecret: process.env.REACT_APP_FOURSQUARE_CLIENT_SECRET 
    });
    this.setState({
      foursquare: foursquare
    })
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };
  // This is for infowindow show the miles
  getDistance = (destination) => {
    const { google } = this.state.mapProps;
    
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    distanceMatrixService.getDistanceMatrix({
      origins: [this.state.userLocation],
      destinations: [destination],
      travelMode: google.maps.TravelMode['WALKING'],
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, function(response, status) {
      if (response.rows[0].elements[0].status === google.maps.DistanceMatrixStatus.OK) {
        let info = response.rows[0].elements[0].distance.text
        window.console.log(info)
        this.setState({
          distance: info
        })
      } else {
        window.console.error(response);
      }
    }.bind(this));
  }

  getPlaceDetails = (plzid) => {
    this.state.foursquare.venues.getVenue({venue_id: plzid })
      .then(res=> {
      if (res.meta.code === 200) {
        let size='110x110'
        let photoUrl = null
        if (res.response.venue.bestPhoto === undefined) {
          photoUrl = 'http://www.historygrandrapids.org/imgs/4101/square/Theaters_html_5bd1fb5.jpg'
        } else {
          photoUrl=res.response.venue.bestPhoto.prefix+size+res.response.venue.bestPhoto.suffix
        }
        let name = res.response.venue.name
        let address= res.response.venue.location.address
        this.setState({
          selectedPlace: {photoUrl: photoUrl, name: name, address: address}
        })
      } 
      // Else default data from map marker is shown
      });
  }

  // When user clicks the list then the info window would open
  onMarkerClickFromList = (e) => {
    if (this.refs.toggleIcon.offsetParent !== null) {
      this.refs.toggleIcon.click()
    }

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
      showingInfoWindow: true,
      distance: 'fetching....'
    });
    this.getPlaceDetails(plzid)
    this.getDistance(currentMkr.address[0]) 
  }
  // When marker icon in map is clicked then we would show infowindow
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      distance: 'fetching....'
    });
    this.getDistance(marker.address[0])
    this.getPlaceDetails(props.identifier)
  }

  // Need to remembers the marker info so that we respond from list and map marker the correct info
  onMarkerMounted  = (element) => {
    if (element !== null)
    this.setState(prevState => ({
      markers: [...prevState.markers, element.marker]
    }))
  }

  updateMap = obj => {
    this.setState({requestOptions: obj})
    this.searchPlacesUsingFourSquare(obj)
    document.getElementById('menuicon').click()
  }

  // Only we need map is ready we can invoke services
  onMapReady = (mapProps, map) => {
    this.setState({
      map: map,
      mapProps: mapProps,
    })
    this.searchPlacesUsingFourSquare(this.state.requestOptions)
  }

  // Third party library Foursquare
  searchPlacesUsingFourSquare = (requestOptions) => {  
    var params = {
      "ll": `${this.state.userLocation.lat},${this.state.userLocation.lng}`,
      "categoryId": requestOptions.type,
      "radius":  requestOptions.range,
      "intent": "browse",
    };
    this.state.foursquare.venues.getVenues(params)
      .then(res=> {
        let plzs = []
        if (res.meta.code === 200) {
          let venues = res.response.venues
          for (let plzObj of venues) {
            plzs.push({placeid: plzObj.id, location: plzObj.location, name: plzObj.name})
          }
          this.setState({
            places: plzs
          })
        }
      });
  }
  
  // This uses google maps placeservice and it is no longer used.
  searchNearby = (requestOptions) => {
    let service, distanceService
    const { google } = this.state.mapProps;
    if (this.state.placeService === null) {
      service = new google.maps.places.PlacesService(this.state.map);
      this.setState({
        placeService: service,
        distanceService: distanceService
      })
    }  else {
      service = this.state.placeService
    }
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
            const googleMapsClient = require('@google/maps').createClient({
              key: process.env.REACT_APP_API_KEY,
              Promise: Promise
            });
            googleMapsClient.timezone({
              location: {lat: position.coords.latitude,
                lng: position.coords.longitude},
              timestamp: new Date()
            })
            .asPromise()
            .then((response) => {
              this.setState({
                timezone: response.json.timeZoneId + ' '+response.json.timeZoneName
              })
            })
            .catch((err) => {
              this.setState({
                mapError: 'Error: Map loading failed. Check API key or quota. '+err.json.errorMessage
              })
            });
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
         <h1 className="text-danger" aria-live="assertive">{this.state.mapError}</h1>
          <nav className="navbar navbar-dark bg-dark" aria-label="Side Nav Bar Menu to search given type and radius">
            <button id="menuicon" ref="toggleIcon" className="navbar-toggler d-block d-md-none" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <h1 className="text-danger">My NeighborHood></h1>
            <p className="text-muted" aria-live="assertive">You are in timezone:{this.state.timezone}</p>
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
            activeMarker={this.state.activeMarker}
            distance={this.state.distance}></MapWithLocation>
          </div>
        </div>        
      </main>
    )
  }
}

export default Dashboard;