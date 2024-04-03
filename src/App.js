import React, { useRef, useContext } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDrag } from 'react-use-gesture'
import SignalBrowser from './components/SignalBrowser'
import { Icon } from 'semantic-ui-react'
import { M2, usePingPongState, useStatusState, useSignalState } from 'onyx-m2-react'
import ConnectionPopup from './components/ConnectionPopup'
import SignalsGrid from './components/SignalsGrid'
import styled, { ThemeProvider } from 'styled-components'
import Grid from './components/Grid'
import { Panel } from './components/Base'
import { clamp } from './utils/utils'
import { DAY_THEME, NIGHT_THEME } from './theme'
import FavouritesGrid from './components/FavouritesGrid'
import { useDebouncedCallback } from 'use-debounce'
import { useHotkeys } from 'react-hotkeys-hook'

import grids from './content/grids'

const displayMode = process.env.REACT_APP_DISPLAY_MODE || 'dark'

/**
 * The App component uses the router to navigate to different panels in the app.
 * The app itself only provides the sidebar menu, the ability to swipe right to
 * reveal the sidebar, and connectivity status reporting.
 */
export default function App() {
  const { transport, dbc } = useContext(M2)
  const [appIsOnline, appLatency] = usePingPongState(1000, 2000)
  const [m2IsOnline, m2Latency, m2Rate] = useStatusState()
  const isSunUp = useSignalState('UI_isSunUp', true)

  const panelRef = useRef(null)
  const panelPos = useRef(0)
  const drag = useDrag(
    ({ event, tap, down, movement: [dx] }) => {
      const { style } = panelRef.current
      let x = clamp(panelPos.current + dx, 0, 150)
      transport.pause()
      if (!down) {
        x = panelPos.current = x > 75 ? 150 : 0
        transport.resume()
        if (!tap) {
          event.stopPropagation()
        }
      }
      style.transform = `translate3d(${x}px, 0, 0)`
    },
    {
      axis: 'x',
      filterTaps: true,
    }
  )

  function handleNavMenuClick(e) {
    panelPos.current = 0
    panelRef.current.style.transform = `translate3d(0, 0, 0)`
  }

  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  if (pathname === '/') {
    navigate('/favourites', { replace: true })
  }
  const cycleThroughPanels = useDebouncedCallback(() => {
    if (pathname.startsWith('/grids')) {
      const gridSlug = pathname.substring(pathname.lastIndexOf('/') + 1)
      const index = grids.findIndex(g => g.slug === gridSlug)
      if (index > 0) {
        navigate(`/grids/${grids[index - 1].slug}`)
      } else {
        navigate('/favourites')
      }
    } else if (pathname.startsWith('/favourites')) {
      navigate(`/grids/${grids[grids.length - 1].slug}`)
    }
  }, 300)

  // a upwards blip of the gear stalk while in drive does nothing in the car,
  // so let's use this to cycle through panels
  const gear = useSignalState('DI_gear', 0)
  const gearStalkStatus = useSignalState('SCCM_gearStalkStatus', 0)
  const GEAR_D = dbc.getSignalNamedValue('DI_gear', 'D')
  const GEAR_STALK_UP = dbc.getSignalNamedValue('SCCM_gearStalkStatus', 'UP_1')
  if (gear === GEAR_D && gearStalkStatus === GEAR_STALK_UP) {
    cycleThroughPanels()
  }
  // simulation on pc
  useHotkeys('pageup', () => cycleThroughPanels())

  let theme = NIGHT_THEME
  if (displayMode === 'light') {
    theme = DAY_THEME
  } else if (displayMode === 'auto') {
    theme = isSunUp ? DAY_THEME : NIGHT_THEME
  }
  return (
    <ThemeProvider theme={theme}>
      <NavMenu as={Grid} columns={1} gap='0' alignContent='start' onClick={handleNavMenuClick}>
        {grids.map(({ name, slug, icon }) => (
          <NavMenuItem as={NavLink} to={`/grids/${slug}`} key={slug}>
            <Icon size='big' name={icon} />
            {name}
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
        <div style={{ position: 'absolute', bottom: '0', padding: '20px' }}>
          <div>{m2Rate} msg/s</div>
          <div>
            {appLatency}ms / {m2Latency}ms
          </div>
        </div>
      </NavMenu>
      <Panel {...drag()} ref={panelRef}>
        <Routes>
          {grids.map(({ slug, tiles, hash }) => (
            <Route
              path={`/grids/${slug}`}
              element={<SignalsGrid key={slug} slug={slug} tiles={tiles} hash={hash} />}
            />
          ))}
          <Route path='/favourites' element={<FavouritesGrid />} />
          <Route
            path='/signals/:categorySlug?/:messageSlug?'
            element={<SignalBrowser basePath='/signals' />}
          />
          <Route
            path='/configuration'
            component={() => {
              window.location.href = '/configuration'
              return null
            }}
          />
        </Routes>
      </Panel>
      <ConnectionPopup appStatus={appIsOnline} m2Status={m2IsOnline} />
    </ThemeProvider>
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
    background-color: hsla(0, 0%, 100%, 0.15);
  }
  &:hover {
    color: white;
    background: hsla(0, 0%, 100%, 0.08);
  }
  min-width: 6em;
  padding: 20px;
`
