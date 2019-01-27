import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SideNavBar extends Component {
  static propTypes = {
    userLocation: PropTypes.object,
    updateMap: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      // typesSupported: ['accounting','airport','amusement_park','aquarium','art_gallery','atm','bakery','bank','bar','beauty_salon','bicycle_store','book_store','bowling_alley','bus_station','cafe','campground','car_dealer','car_rental','car_repair','car_wash','casino','cemetery','church','city_hall','clothing_store','convenience_store','courthouse','dentist','department_store','doctor','electrician','electronics_store','embassy','fire_station','florist','funeral_home','furniture_store','gas_station','gym','hair_care','hardware_store','hindu_temple','home_goods_store','hospital','insurance_agency','jewelry_store','laundry','lawyer','library','liquor_store','local_government_office','locksmith','lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company','museum','night_club','painter','park','parking','pet_store','pharmacy','physiotherapist','plumber','police','post_office','real_estate_agency','restaurant','roofing_contractor','rv_park','school','shoe_store','shopping_mall','spa','stadium','storage','store','subway_station','supermarket','synagogue','taxi_stand','train_station','transit_station','travel_agency','veterinary_care','zoo'],
      typesSupported: [],
      range: '750',
      address: '',
      errorMessage: '',
      latitude: null,
      longitude: null,
      isGeocoding: false,
      type: '4bf58dd8d48988d1e0931735',
    };
  }
  componentDidMount() {
    this.getFourSquareCategories()
  }
  getFourSquareCategories = () => {
    let clientid = '4OJG0VMG1FNLY3NE0ILKG2D0JSGVQSLSO1WUSQ02AJBYHBFM'// process.env.FOURSQUARE_CLIENT_ID
    let clientseret= 'VLKIOSOVXNRSZ4DVYXDBARYLG33KLEX4QYUI1B51PBV1U2D2' //process.env.FOURSQUARE_CLIENT_SECRET
    
    let url=`https://api.foursquare.com/v2/venues/categories?client_id=${clientid}&client_secret=${clientseret}&v=20190126`
    fetch(url).then( response => {
            return response.json();
      }).then( jsonResponse => {
          let typeS = []
          for (let category of jsonResponse.response.categories) { 
            typeS.push(...category.categories) 
          }
          this.setState({
            typesSupported: typeS
          })
      })
  }

  changeType = val => {
    this.setState({
      type: val.currentTarget.value
    })
  }

  onRangeChanged = e => {
    if (e.currentTarget.checked) {
      this.setState({
        range: e.currentTarget.value
      })
    }
  }

  loadMap = (e) => {
    this.props.updateMap({type: this.state.type, range: this.state.range})
  }

  render() {
    const options = this.state.typesSupported.map((type) =>
    <option key={type.id} value={type.id}>{type.name}</option>
    );
    return (
    <section>
    <div className="form-group">
      <label htmlFor="placeType">Select Type of Search:</label>
      <select className="form-control" id="placeType" value={this.state.type} onChange={this.changeType}>
        {options}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="address">Select Address Radius:</label>
      <div className="form-check">
        <label className="form-check-label">
          <input type="radio" className="form-check-input" name="kmrange" value="750" checked={this.state.range === '750'} 
                                  onChange={this.onRangeChanged}  />750
        </label>
      </div>
      <div className="form-check">
        <label className="form-check-label">
          <input type="radio" className="form-check-input" name="kmrange"  value="1000"  checked={this.state.range === '1000'}  
          onChange={this.onRangeChanged} />1000
        </label>
      </div>
      <div className="form-check">
        <label className="form-check-label">
          <input type="radio" className="form-check-input" name="kmrange"  value="1250"  checked={this.state.range === '1250'} 
          onChange={this.onRangeChanged} />1250
        </label>
      </div>
      </div>
      <div  className="form-group">
      <button type="button" className="btn btn-secondary" onClick={this.loadMap}>Search</button>
      </div>
      </section>
    );
  }
}
export default SideNavBar
