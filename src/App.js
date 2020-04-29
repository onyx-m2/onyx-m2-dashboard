import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Button } from 'semantic-ui-react'
import M2 from './services/m2'

import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

export default function App() {
  const theme = ''//useContext(ThemeContext)


  // Connection effect
  useEffect(() => {
    const handle = () => toast({
      icon: 'car',
      color: 'olive',
      title: 'Connected',
      size: 'tiny',
      description: 'Onyx M2 is online',
    })
    M2.addEventListener('connect', handle)
    M2.connect()
    return () => M2.removeEventListener('connect', handle)
  })

  // Disconnection effect
  useEffect(() => {
    const handle = (event) => {
      let icon = 'car'
      let entity = ''
      if (event.reason == 'network') {
        icon = 'signal'
        entity = 'Dashboard'
      }
      toast({
        icon,
        color: 'orange',
        title: 'Disconnected',
        size: 'tiny',
        description: `Onyx M2 ${entity} is offline`,
      })
    }
    M2.addEventListener('disconnect', handle)
    return () => M2.removeEventListener('disconnect', handle)
  })

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
      <SemanticToastContainer position='bottom-right' animation='fade left' />
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
