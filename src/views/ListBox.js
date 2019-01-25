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
      <ul className="list-group">
      {
        places.map((plz) => (<li key={plz.name} className="list-group-item list-group-item-action">
        <a href="#donothing" className="b-btn" data-place-name={plz.name}
        onClick={this.invokeParentHandler} >{ plz.name }</a>
        </li>)
        )}
      </ul>
    )
  }
}
export default ListBox
