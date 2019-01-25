# My Neighborhood Map
### Features!

  - Search near ATM, bus stops etc in a give radius
 ### Setup
 - Clone the repository
 - create a ENV variable REACT_APP_API_KEY by one of the two options
 -  in Project root folder create a .env file like below
 `REACT_APP_API_KEY =<Your Google Map APi Key>`
 - Or System Environment Variable
 - For develement mode
 `  npm install
   npm start`

 -For Production mode
 `npm run build
serve -s build`
Server will give the key port url ex : http://localhost:5000 

### libraries Used
`"google-maps-react": "^2.0.2",`
`bootstrap: 4`