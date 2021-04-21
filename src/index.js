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
import Configuration from './components/Configuration'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

const dbcUrl = process.env.REACT_APP_CONFIG_DBCURL || 'https://raw.githubusercontent.com/onyx-m2/dbc/master/tesla_model3.dbc'
console.log(`Loading DBC from url "${dbcUrl}"`)

/**
 * Initialize the application, and render once all the data is loaded.
 */
async function init(config) {
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


let config = load('config', 1)

// if native interface is available, allow it to override the config values
if (global.M2) {
  config = {
    server: global.M2.getPreference('server_hostname'),
    pin: global.M2.getPreference('server_pin'),
    secure: true
    }
}
if (config && window.location.pathname !== '/configuration') {
  init(config)
}
else {
  // monkey patch in the configuration screen; pretty lazy, but works
  ReactDOM.render(
    <ThemeProvider theme={DAY_THEME}>
      <Panel>
        <Configuration theme={DAY_THEME} />
      </Panel>
    </ThemeProvider>,
    document.getElementById('root')
  )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
