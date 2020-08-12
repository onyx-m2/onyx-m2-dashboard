import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-less/semantic.less'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker'

import { M2Provider } from './contexts/M2'
import { SignalProvider } from './contexts/SignalContext'
import DBC from './utils/DBC'
import { m2, cms, configure } from './utils/services'
import { Panel, Spinner } from './components/Base';
import { DAY_THEME } from './theme';
import { CMSProvider } from './contexts/CMS';
import { load } from './utils/persistance';
import Configuration from './components/Configuration';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';

/**
 * Load the DBC from the M2 server.
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
 * Load the content from the CMS server.
 */
async function loadContent(model) {
  while (true) {
    try {
      const [ { data: signals }, { data: menu } ] = await Promise.all([
        cms.get('/signals'),
        cms.get('/menu')
      ])
      return { signals, menu }
    }
    catch (e) {
      console.warn(`Unable to load content (${e.message}), retrying in 1 second`)
      await new Promise(r => setTimeout(r, 1000))
    }
  }
}

/**
 * Initialize the application, and render once all the data is loaded.
 */
async function init() {

  // Render a loading screen until the actual initialization is done
  ReactDOM.render(
    <Panel theme={DAY_THEME}>
      <Spinner colour='201,0,0' size='260' image='/favicon.png' />
    </Panel>,
    document.getElementById('root')
  )

  const dbc = await loadDBC()
  const { signals, menu } = await loadContent()
  ReactDOM.render(
    <React.StrictMode>
      <CMSProvider signals={signals} menu={menu}>
        <M2Provider dbc={dbc}>
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

// Check for configuration requests, or first time run (super lazy implementation - but better than nothing?)
async function checkConfig() {
  const config = load('config', 1)
  if (config && window.location.pathname !== '/configuration') {
    await configure(config)
    init()
  }
  else {
    ReactDOM.render(
      <ThemeProvider theme={DAY_THEME}>
        <Panel>
          <Configuration theme={DAY_THEME} />
        </Panel>
      </ThemeProvider>,
      document.getElementById('root')
    )
  }
}

checkConfig();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()