# My Neighborhood Map
### Features!

  - Search near ATM, bus stops etc in a give radius. You get to see a list and on clicking we get to see the distance from the current location. For info purpose we do show the users current timezon info.

### This Application uses below libraries
  *) google-maps-react 
  *) react-foursquare
  &) @google/maps

### TechStack used
  *) Bootstrap
  *) Jquery
  *) React scripts
  *) Foursquare
  *) Google Maps

 ### Setup
 - Clone the repository
 - create a ENV variable REACT_APP_API_KEY, REACT_APP_FOURSQUARE_CLIENT_ID, REACT_APP_FOURSQUARE_CLIENT_SECRET by one of the two options
 -  in Project root folder create a .env file like below
 `REACT_APP_API_KEY =<Your Google Map APi Key>`
 `REACT_APP_FOURSQUARE_CLIENT_ID= =<Your Foursquare APi Key>`
`REACT_APP_FOURSQUARE_CLIENT_SECRET=<Your Foursquare APi Key>`
 - Or System Environment Variable

###how to run the project in development mode
 `  npm install --verbose
   npm start`

###how to run the project in production mode
 `npm run build
serve -s build`
Server will give the key port url ex : http://localhost:5000 

###FAQ
*) If your API keys have issues you get Errors and alert window.
*) Quota exceeded is the other big issue. Photos only will be unavailable as it is for premium users
*) Please review console and network tab of dev tools if still app doesnt work as expected.
