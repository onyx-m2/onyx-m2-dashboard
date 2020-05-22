import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-less/semantic.less'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker'

import { M2Provider } from './contexts/M2'
import { SignalProvider } from './contexts/SignalContext'
import DBC from './utils/DBC'
import { m2 } from './utils/services'
import { Panel, Spinner } from './components/Base';

/**
 * Load the DBC from the server.
 */
async function loadDBC(model) {
  while (true) {
    try {
      const definitions = await m2.get('/dbc')
      return new DBC(definitions.data)
    }
    catch (e) {
      console.warn(`Unable to load DBC (${e.message}), retrying in 1 second`)
      await new Promise(r => setTimeout(r, 1000))
    }
  }
}

/**
 * Initialize the application, and render once all the data is loaded.
 */
async function init() {
  const dbc = await loadDBC()
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
  <Panel>
    <Spinner color='rgb(201,0,0)' image='favicon.png' />
  </Panel>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()