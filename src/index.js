import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-less/semantic.less'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker'

import { M2Provider } from './contexts/M2'
import { SignalProvider } from './contexts/SignalContext'
import { Panel } from './components/Base';
import { DAY_THEME } from './theme';
import { CMSProvider } from './contexts/CMS';
import { load } from './utils/persistance';
import Configuration from './components/Configuration';
import ElectronicInstrumentCluster from './ElectronicInstrumentCluster';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';

/**
 * Initialize the application, and render once all the data is loaded.
 */
async function init(config) {
  ReactDOM.render(
    <React.StrictMode>
      <CMSProvider>
        <M2Provider config={config}>
          <SignalProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SignalProvider>
        </M2Provider>
      </CMSProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

/**
 * Initialize the application in electronic instrument cluster mode, and render once
 * all the data is loaded.
 */
async function initEIC(config) {
  ReactDOM.render(
    <React.StrictMode>
        <M2Provider config={config}>
          <SignalProvider>
            <ElectronicInstrumentCluster />
          </SignalProvider>
        </M2Provider>
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
  // monkey patch in the electronic instrument cluster mobile experiment here
  // TODO: integrate this better if this works
  if (window.location.host.startsWith('eic') || window.location.pathname === '/eic') {
    initEIC(config)
  }
  else {
    init(config)
  }
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