import React, { useState, useRef } from 'react'
import { BrowserRouter, Switch, Route, Link, Redirect, NavLink } from 'react-router-dom'
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { useDrag } from 'react-use-gesture'
//import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Icon } from 'semantic-ui-react'
import { usePingPongState, useStatusState } from './contexts/M2'
import ConnectionPopup from './components/ConnectionPopup';
import FavouritesGrid from './components/FavouritesGrid';
import SnifferPanel from './components/SnifferPanel';
import { FavouritesProvider } from './contexts/FavouritesContext';
import styled, { ThemeProvider } from 'styled-components';
import { Grid } from 'styled-css-grid';
import { Panel } from './components/Base';
import { clamp } from './utils/utils';
import { useSignalState } from './contexts/SignalContext';
import { DAY_THEME, NIGHT_THEME } from './theme';

/**
 * The App component uses the router to navigate to different panels in the app.
 * The app itself only provides the sidebar menu, the ability to swipe right to
 * reveal the sidebar, and connectivity status reporting.
 */
export default function App() {

  const [ appIsOnline, appLatency ] = usePingPongState(1000, 4000)
  const [ m2IsOnline, m2Latency, m2Rate ] = useStatusState()

  const panelRef = useRef(null)
  const panelPos = useRef(0)
  const drag = useDrag(({ down, movement: [dx] }) => {
    const { style } = panelRef.current
    let x = clamp(panelPos.current + dx, 0, 150)
    if (!down) {
      x = panelPos.current = (x > 75) ? 150 : 0
    }
    style.transform = `translate3d(${x}px, 0, 0)`
  }, {
    axis: 'x',
    rubberband: true
  })

  const isSunUp = useSignalState('UI_isSunUp', true)

  function handleNavMenuClick(e) {
    panelPos.current = 0
    panelRef.current.style.transform = `translate3d(0, 0, 0)`
  }

  return (
    <BrowserRouter>
      <NavMenu as={Grid} columns={1} gap={0} alignContent='start' onClick={handleNavMenuClick}>
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
      <ThemeProvider theme={isSunUp ? DAY_THEME : NIGHT_THEME}>
        <Panel {...drag()} ref={panelRef}>
          <FavouritesProvider>
            <Switch>
              <Route exact path='/'>
                <FavouritesGrid />
              </Route>
              <Route exact path='/signals/:categorySlug?/:messageSlug?'>
                <SignalBrowser basePath='/signals' />
              </Route>
              <Route exact path='/sniffer'>
                <SnifferPanel />
              </Route>
            </Switch>
          </FavouritesProvider>
        </Panel>
      </ThemeProvider>
      <ConnectionPopup appStatus={appIsOnline} m2Status={m2IsOnline} />
    </BrowserRouter>
  )
}

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
