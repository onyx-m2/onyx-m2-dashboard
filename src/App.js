import React, { useState, useRef, useEffect, useContext } from 'react'
import { BrowserRouter, Switch, Route, Link, Redirect, NavLink } from 'react-router-dom'
import 'react-semantic-toasts/styles/react-semantic-alert.css'
import { useDrag } from 'react-use-gesture'
import SignalBrowser from './components/SignalBrowser'
import { Icon } from 'semantic-ui-react'
import M2, { usePingPongState, useStatusState } from './contexts/M2'
import ConnectionPopup from './components/ConnectionPopup'
import SignalsGrid from './components/SignalsGrid'
import SnifferPanel from './components/SnifferPanel'
import { FavouritesProvider } from './contexts/FavouritesContext'
import styled, { ThemeProvider } from 'styled-components'
import { Grid } from 'styled-css-grid'
import { Panel } from './components/Base'
import { clamp } from './utils/utils'
import { cms } from './utils/services'
import { useSignalState } from './contexts/SignalContext'
import { DAY_THEME, NIGHT_THEME } from './theme'
import FavouritesGrid from './components/FavouritesGrid'

/**
 * The App component uses the router to navigate to different panels in the app.
 * The app itself only provides the sidebar menu, the ability to swipe right to
 * reveal the sidebar, and connectivity status reporting.
 */
export default function App() {

  const { freeze } = useContext(M2)
  const [ appIsOnline, appLatency ] = usePingPongState(1000, 4000)
  const [ m2IsOnline, m2Latency, m2Rate ] = useStatusState()

  const panelRef = useRef(null)
  const panelPos = useRef(0)
  const drag = useDrag(({ down, movement: [dx] }) => {
    const { style } = panelRef.current
    let x = clamp(panelPos.current + dx, 0, 150)
    freeze(true)
    if (!down) {
      x = panelPos.current = (x > 75) ? 150 : 0
      freeze(false)
    }
    style.transform = `translate3d(${x}px, 0, 0)`
  }, {
    axis: 'x',
    rubberband: true
  })

  const isSunUp = useSignalState('UI_isSunUp', true)

  const [ grids, setGrids ] = useState([])
  useEffect(() => {
    const fetch = async () => {
      const { data: { grids } } = await cms.get('/menu')
      setGrids(grids)
    }
    fetch()
  }, [])

  function handleNavMenuClick(e) {
    panelPos.current = 0
    panelRef.current.style.transform = `translate3d(0, 0, 0)`
  }

  return (
    <BrowserRouter>
      <NavMenu as={Grid} columns={1} gap={0} alignContent='start' onClick={handleNavMenuClick}>
        {grids.map(grid => (
          <NavMenuItem as={NavLink} to={`/grids/${grid.name.toLowerCase()}`} key={grid.id} tiles={grid.tiles} exact>
            <Icon size='big' name={grid.icon} />
            {grid.name}
          </NavMenuItem>
        ))}
        <NavMenuItem as={NavLink} to='/favourites'>
          <Icon size='big' name='star' />
          Favourites
        </NavMenuItem>
        <NavMenuItem as={NavLink} to='/signals'>
          <Icon size='big' name='random' />
          Signals
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
                <Redirect to={`/signals`} />
              </Route>
              {grids.map(g => (
                <Route exact key={g.id} path={`/grids/${g.name.toLowerCase()}`}>
                  <SignalsGrid grid={g} />
                </Route>
              ))}
              <Route exact path='/favourites'>
                <FavouritesGrid />
              </Route>
              <Route exact path='/signals/:categorySlug?/:messageSlug?'>
                <SignalBrowser basePath='/signals' />
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
