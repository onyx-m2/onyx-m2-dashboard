import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-less/semantic.less'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker'

import { M2Provider } from './contexts/M2'
import { SignalProvider } from './contexts/SignalContext';
import DBC from './utils/DBC'
import { m2 } from './utils/services'
import { Loader } from 'semantic-ui-react';

/**
 * Load the DBC for the specified car model.
 * @param {String} model Car model, currently only 'tm3' is supported
 */
async function loadDBC(model) {
  while (true) {
    try {
      const [categories, definitions] = await Promise.all([
        m2.get(`/dbc/${model}/categories.json`),
        m2.get(`/dbc/${model}/definitions.json`)
      ])
      return new DBC(categories.data, definitions.data)
    }
    catch {
      console.warn('Unable to load DBC, retrying in 1 second')
      await new Promise(r => setTimeout(r, 1000))
    }
  }
}

/**
 * Initialize the application, and render once all the data is loaded.
 */
async function init() {
  const dbc = await loadDBC('tm3')
  ReactDOM.render(
    <React.StrictMode>
      <M2Provider dbc={dbc}>
        <SignalProvider>
          <App />
        </SignalProvider>
      </M2Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

// Render a loading screen until the actual initialization is done
init()
ReactDOM.render(
  <Loader style={{height: '100vh'}} active size='massive'>Loading</Loader>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()