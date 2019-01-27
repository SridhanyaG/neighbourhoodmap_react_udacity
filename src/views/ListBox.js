import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css/listbox.css'

class ListBox extends Component {
  static propTypes = {
    places: PropTypes.array,
    invokerMarker: PropTypes.func.isRequired
  }
  invokeParentHandler = (e) => {
    this.props.invokerMarker(e)
    e.preventDefault()
  }
  render() {
    let places = this.props.places
    return (
      <ul className="list-group" aria-label="Results of Places near by">
      {
        places.map((plz) => (<li  key={plz.placeid} className="list-group-item list-group-item-action">
        <a title="'To know more about '+{plz.name}"role="button" href="{JavaScript:Void(0);}" className="b-btn" data-place-id={plz.placeid}
        onClick={this.invokeParentHandler} >{ plz.name }</a>
        </li>)
        )}
      </ul>
    )
  }
}
export default ListBox
