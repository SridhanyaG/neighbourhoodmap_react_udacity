import React from 'react'
import ReactDOM from 'react-dom'
import App from './views/App'
import './index.css'
import './views/include/bootstrap'
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';


ReactDOM.render(<BrowserRouter>
                  <App />
                </BrowserRouter>, document.getElementById('root'))
registerServiceWorker();