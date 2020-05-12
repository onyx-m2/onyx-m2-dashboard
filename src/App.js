import React, { useState } from 'react'
import { BrowserRouter, Switch, Route, Link, Redirect, NavLink } from 'react-router-dom'
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { useSwipeable } from 'react-swipeable'
import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { usePingPongState, useStatusState } from './contexts/M2'
import ConnectionPopup from './components/ConnectionPopup';
import FavouritesPanel from './components/FavouritesPanel';
import SnifferPanel from './components/SnifferPanel';
import { FavouritesProvider } from './contexts/FavouritesContext';

/**
 * The App component uses the router to navigate to different panels in the app.
 * The app itself only provides the sidebar menu, the ability to swipe right to
 * reveal the sidebar, and connectivity status reporting.
 */
export default function App() {

  const [ appIsOnline, appLatency ] = usePingPongState(1000, 4000)
  const [ m2IsOnline, m2Latency, m2Rate ] = useStatusState()

  const swipers = useSwipeable({
    onSwipedLeft: () => setSidebarVisible(false),
    onSwipedRight: () => setSidebarVisible(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  let [ sidebarVisible, setSidebarVisible ] = useState(false)

  return (
    <BrowserRouter>
      <Sidebar.Pushable>
        <Sidebar as={Menu} borderless animation='uncover' direction='left'
          icon='labeled' inverted vertical width='thin'
          visible={sidebarVisible} onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          <Menu.Item as={NavLink} to='/' exact>
            <Icon name='outline favorite' />
            Favourites
          </Menu.Item>
          <Menu.Item as={NavLink} to='/signals'>
            <Icon name='random' />
            Signals
          </Menu.Item>
          <Menu.Item as={NavLink} to='/sniffer'>
            <Icon name='braille' />
            Sniffer
          </Menu.Item>
          <Menu.Item>
            <div>{m2Rate} msg/s</div>
            <div>App: {appLatency} ms</div>
            <div>M2: {m2Latency} ms</div>
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <div className='App' {...swipers}>
            <FavouritesProvider>
              <Switch>
                <Route exact path='/'>
                  <FavouritesPanel />
                </Route>
                <Route exact path='/signals/:categoryPath?/:messagePath?'>
                  <SignalBrowser basePath='/signals' />
                </Route>
                <Route exact path='/sniffer'>
                  <SnifferPanel />
                </Route>
              </Switch>
            </FavouritesProvider>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <ConnectionPopup app={appIsOnline} m2={m2IsOnline} />
    </BrowserRouter>
  )
}