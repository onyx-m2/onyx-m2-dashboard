import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { useSwipeable } from 'react-swipeable'
import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { usePingPongState, useStatusState } from './services/m2'
import ConnectionPopup from './components/ConnectionState';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

export default function App() {

  const [ appConnected, appLatency ] = usePingPongState(1000, 4000)
  const [ m2Online, m2Latency, m2Rate ] = useStatusState()

  const swipers = useSwipeable({
    onSwipedLeft: () => setNavVisible(false),
    onSwipedRight: () => setNavVisible(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  let [ navVisible, setNavVisible ] = useState(false)

  // toast({
  //   type: 'warning',
  //   title: 'Disconnected',
  //   size: 'tiny',
  //   description: `Onyx is offline`,
  //   time: 100000
  // })

  return (
    <BrowserRouter>
      <Sidebar.Pushable>
        <Sidebar as={Menu} borderless animation='uncover' direction='left'
          icon='labeled' inverted vertical width='thin'
          visible={navVisible} onClick={() => setNavVisible(!navVisible)}
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
      <ConnectionPopup app={appConnected} m2={m2Online} />
      <SemanticToastContainer>
      </SemanticToastContainer>
    </BrowserRouter>
  )
}