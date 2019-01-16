import React, { Component } from 'react';
// import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
// import { GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types';

class SideNavBarSearchInput extends Component {
  static propTypes = {
    address: PropTypes.object.isRequired
  }
  
  componentWillReceiveProps() {
  }

  render() {
    return (
      <div>I am a select comp</div>
    )
  }
}
export default SideNavBarSearchInput;