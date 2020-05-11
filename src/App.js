import React, { useState } from 'react'
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { useSwipeable } from 'react-swipeable'
import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { usePingPongState, useStatusState } from './services/m2'
import ConnectionPopup from './components/ConnectionPopup';

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
          <Menu.Item as={Link} to='/'>
            <Icon name='home' />
            Home
          </Menu.Item>
          <Menu.Item as={Link} to='/signals'>
            <Icon name='random' />
            Signals
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='camera' />
            Channels
          </Menu.Item>
          <Menu.Item>
            <div>{m2Rate} msg/s</div>
            <div>App: {appLatency} ms</div>
            <div>M2: {m2Latency} ms</div>
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <div className='App' {...swipers}>
            <Switch>
              <Route exact path='/signals/:categoryPath?/:messagePath?'>
                <SignalBrowser basePath='/signals' />
              </Route>
              <Route exact path='/'>
                <Redirect to='/signals' />
              </Route>
            </Switch>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <ConnectionPopup app={appIsOnline} m2={m2IsOnline} />
    </BrowserRouter>
  )
}