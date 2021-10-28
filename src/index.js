import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-less/semantic.less'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { M2Provider, SignalProvider } from 'onyx-m2-react'
import { Panel } from './components/Base'
import { DAY_THEME } from './theme'
import { FavouritesProvider } from './contexts/Favourites'
import { load } from './utils/persistance'
import Configuration, { CONFIG_VERSION } from './components/Configuration'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

const dbcUrl = process.env.REACT_APP_CONFIG_DBCURL || 'https://raw.githubusercontent.com/onyx-m2/dbc/master/tesla_model3.dbc'
console.log(`Loading DBC from url "${dbcUrl}"`)

/**
 * Renders the app after loading the dbc file.
 */
async function renderApp(config) {
  const { data: dbcFile } = await axios(dbcUrl)
  ReactDOM.render(
    <React.StrictMode>
      <FavouritesProvider>
        <M2Provider config={config} dbcFile={dbcFile}>
          <SignalProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SignalProvider>
        </M2Provider>
      </FavouritesProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

/**
 * Renders the configuration page, allowing user to input settings
 * to run the app on their infrastructure.
 */
function renderConfigurationPage() {
  ReactDOM.render(
    <ThemeProvider theme={DAY_THEME}>
      <Panel>
        <Configuration theme={DAY_THEME} />
      </Panel>
    </ThemeProvider>,
    document.getElementById('root')
  )
}

/**
 * Obtains from the browser a reference to a previously paired bluetooth
 * device. Returns null if no paired device exists.
 */
async function getPairedBleDevice() {
  if (await navigator.bluetooth.getAvailability()) {
    const devices = await navigator.bluetooth.getDevices()
    if (devices) {
      return devices[0]
    }
  }
  return null
}

/**
 * Initializes the application, rendering the app itself or the configuration
 * page depending on previously set settings.
 */
async function initialize() {
  let config = load('config', CONFIG_VERSION)

  // if native interface is available, allow it to override the config values
  if (global.M2) {
    config = {
      server: global.M2.getPreference('server_hostname'),
      pin: global.M2.getPreference('server_pin'),
      secure: true
      }
  }
  if (config && window.location.pathname !== '/configuration') {
    if (config.ble) {
      config.ble = await getPairedBleDevice()
      if (!config.ble) {
        return renderConfigurationPage()
      }
    }
    renderApp(config)
  }
  else {
    // monkey patch in the configuration screen; pretty lazy, but works
    renderConfigurationPage()
  }
}

initialize()


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

