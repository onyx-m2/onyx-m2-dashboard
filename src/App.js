import React, { useState } from 'react'
import { BrowserRouter, Switch, Route, Link, Redirect, NavLink } from 'react-router-dom'
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { useDrag } from 'react-use-gesture'
//import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Icon } from 'semantic-ui-react'
import { usePingPongState, useStatusState } from './contexts/M2'
import ConnectionPopup from './components/ConnectionPopup';
import FavouritesPanel from './components/FavouritesPanel';
import SnifferPanel from './components/SnifferPanel';
import { FavouritesProvider } from './contexts/FavouritesContext';
import styled from 'styled-components';
import { Grid } from 'styled-css-grid';

/**
 * The App component uses the router to navigate to different panels in the app.
 * The app itself only provides the sidebar menu, the ability to swipe right to
 * reveal the sidebar, and connectivity status reporting.
 */
export default function App() {

  const [ appIsOnline, appLatency ] = usePingPongState(1000, 4000)
  const [ m2IsOnline, m2Latency, m2Rate ] = useStatusState()

  const [ panelPos, setPanelPos ] = useState(0)
  const drag = useDrag(({ down, movement: [x] }) => {
    if (x !== 0) {
      if (down) {
        if (x > 0) {
          if (panelPos === 0) {
            setSidebarVisible(true)
          }
          setPanelPos(Math.min(x, 150))
        } else {
          if (panelPos === 0) {
            setSidebarVisible(false)
          }
          setPanelPos(Math.min(-x, 0))
        }
      }
      else {
        if (x > 75) {
          setSidebarVisible(true)
          setPanelPos(150)
        } else {
          setSidebarVisible(false)
          setPanelPos(0)
        }
      }
    }
  }, {
    axis: 'x',
    rubberband: true
  })

  let [ sidebarVisible, setSidebarVisible ] = useState(true)

  function handleMenuClick(e) {
    if (sidebarVisible) {
      setSidebarVisible(false)
      setPanelPos(0)
    }
  }

  return (
    <BrowserRouter>
      <NavMenu as={Grid} columns={1} gap={0} alignContent='start' visible={sidebarVisible} onClick={handleMenuClick}>
        <NavMenuItem as={NavLink} to='/' exact>
          <Icon size='big' name='outline favorite' />
          Favourites
        </NavMenuItem>
        <NavMenuItem as={NavLink} to='/signals'>
          <Icon size='big' name='random' />
          Signals
        </NavMenuItem>
        <NavMenuItem as={NavLink} to='/sniffer'>
          <Icon size='big' name='braille' />
          Sniffer
        </NavMenuItem>
        <div style={{position: 'absolute', bottom: '0', padding: '20px'}}>
          <div>{m2Rate} msg/s</div>
          <div>App: {appLatency} ms</div>
          <div>M2: {m2Latency} ms</div>
        </div>
      </NavMenu>
      <PanelBacking {...drag()} position={panelPos}>
        <FavouritesProvider>
          <Switch>
            <Route exact path='/'>
              <FavouritesPanel />
            </Route>
            <Route exact path='/signals/:categorySlug?/:messageSlug?'>
              <SignalBrowser basePath='/signals' />
            </Route>
            <Route exact path='/sniffer'>
              <SnifferPanel />
            </Route>
          </Switch>
        </FavouritesProvider>
      </PanelBacking>
      <ConnectionPopup appStatus={appIsOnline} m2Status={m2IsOnline} />
    </BrowserRouter>
  )
}

const PanelBacking = styled.div`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  transform: ${props => `translate3d(${props.position}px, 0, 0)`};
  padding: 10px 20px 20px 20px;
  display: flex;
  background-color: #fafafa;
  &.inverted {
    background-color: rgb(9,9,9);
  }
`

const NavMenu = styled.div`
  position: fixed;
  height: 100vh;
  width: 150px;
  border: none;
  background: #000;
  box-shadow: none;
  text-align: center;
  & * {
    color: white;
  }
`
const NavMenuItem = styled.div`
  background-color: black;
  & > i {
    margin-bottom: 10px;
  }
  &.active {
    font-weight: 700;
    background-color: hsla(0,0%,100%,.15);
  }
  &:hover {
    color: white;
    background: hsla(0,0%,100%,.08);
  }
  min-width: 6em;
  padding: 20px;
`
