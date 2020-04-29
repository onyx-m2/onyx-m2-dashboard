import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Button } from 'semantic-ui-react'
import M2 from './services/m2'

export default function App() {
  const theme = ''//useContext(ThemeContext)

  // function useM2Effect(event, handler) {
//   useEffect(() => {
//     M2.addEventListener(event, handler)
//     return () => M2.removeEventListener(event, handler)
//   })
// }

  useEffect(() => {
    M2.connect()
  }) /// <<< TODO: move to App

  return (
    <BrowserRouter>
      <div className={`App ${theme}`}>
        <Switch>
          <Route exact path='/signals/:categoryPath?/:messagePath?'>
            <SignalBrowser basePath='/signals' />
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
        <nav>
          <Button primary content="Name" />
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/signals'>Signal Browser</Link>
            </li>
          </ul>
        </nav>
    </div>
  )
}
