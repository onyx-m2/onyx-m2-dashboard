import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { SemanticToastContainer as ToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { useSwipeable } from 'react-swipeable'
import './App.css'
import SignalBrowser from './components/SignalBrowser'
import { Button, Sidebar, Menu, Icon } from 'semantic-ui-react'
import M2 from './services/m2'


export default function App() {
  const theme = ''//useContext(ThemeContext)

  // Connection effect
  useEffect(() => {
    const handle = () => toast({
      type: 'success',
      icon: 'car',
      title: 'Connected',
      size: 'tiny',
      description: 'Onyx M2 is online',
    })
    M2.addEventListener('connect', handle)
    M2.connect()
    return () => M2.removeEventListener('connect', handle)
  }, [])

  // Disconnection effect
  useEffect(() => {
    const handle = (event) => {
      let icon = 'car'
      let entity = ''
      if (event.reason === 'network') {
        icon = 'signal'
        entity = 'Dashboard'
        setTimeout(M2.connect, 1000)
      }
      toast({
        type: 'warning',
        icon,
        title: 'Disconnected',
        size: 'tiny',
        description: `Onyx M2 ${entity} is offline`,
      })
    }
    M2.addEventListener('disconnect', handle)
    return () => M2.removeEventListener('disconnect', handle)
  }, [])

  // let [ swiping, setSwiping ] = useState({tracking: false, position: 0})
  // const swipers = useSwipeable({
  //   onSwiping: () => {

  //   }
  //   onSwipedLeft: () => {
  //     setSwiping({tracking: false})
  //     setNavVisible(false)
  //   }
  //   onSwipedRight: () => {
  //     setSwiping({tracking: false})
  //     setNavVisible(true)
  //   },
  //   preventDefaultTouchmoveEvent: true,
  //   trackMouse: true
  // });

  const swipers = useSwipeable({
    onSwipedLeft: () => setNavVisible(false),
    onSwipedRight: () => setNavVisible(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  let [ navVisible, setNavVisible ] = useState(false)
  return (
    <BrowserRouter>
      <div>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            borderless
            animation='uncover'
            direction='left'
            icon='labeled'
            inverted
            vertical
            visible={navVisible}
            width='thin'
            onClick={() => setNavVisible(!navVisible)}
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
          </Sidebar>
          <Sidebar.Pusher>
            <div className={`App ${theme}`} {...swipers}>
              <Switch>
                <Route exact path='/signals/:categoryPath?/:messagePath?'>
                  <SignalBrowser basePath='/signals' />
                </Route>
                <Route exact path='/'>
                  <Home />
                </Route>
              </Switch>
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
      <ToastContainer position='bottom-right' animation='fade left' />
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
