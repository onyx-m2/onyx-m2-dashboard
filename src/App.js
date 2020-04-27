import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Button } from 'semantic-ui-react'

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        {/* <nav>
          <Button primary content="Name" />
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/signals'>Signal Browser</Link>
            </li>
          </ul>
        </nav> */}
        <Switch>
          <Route exact path='/signals/:categoryPath?/:messagePath?'>
            <SignalBrowser />
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
  return <h2>Home</h2>
}

export default App
