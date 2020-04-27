import React, { Component } from 'react'
import { Menu, Segment, Item, Header } from 'semantic-ui-react'
import './SignalBrowser.css'
import Signal from './Signal'
import dbc from '../services/dbc'
import m2 from '../services/m2'
import { Redirect, Link, withRouter } from 'react-router-dom'
import memoizeOne from 'memoize-one'

class Category extends Component {
  render() {
    const { url, category, selected } = this.props
    const { path, name } = category
    return (
      <Menu.Item as={Link} to={`${url}/${path}`} active={selected} className='Category'>
        <Header size='tiny' as='h4' color='grey' content={path} />
        {name}
      </Menu.Item>
    )
  }
}

class Message extends Component {
  render() {
    const { url, message, selected } = this.props
    const { id, name, category, path } = message
    return (
      <Menu.Item as={Link} to={`${url}/${category}/${path}`} active={selected} className='Message'>
        <Header as='h5' size='tiny' color='grey' content={id} />
        {name}
      </Menu.Item>
    )
  }
}

class SignalBrowser extends Component {

  constructor(props) {
    console.log('constructor')
    super(props)
    this.state = {}
    this.handleConnect = this.handleConnect.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
  }

  // updateMessageState() {
  //   const { categoryPath, messagePath } = this.props.match.params
  //   const message = dbc.getMessageFromPath(categoryPath, messagePath)
  //   this.setState({
  //     category: dbc.getCategory(categoryPath),
  //     messages: dbc.getCategoryMessages(categoryPath),
  //     message,
  //     signals: dbc.getMessageSignals(message)
  //   })
  //   m2.disableAllMessages()
  //   m2.enableMessage(message)
  // }

  componentDidMount() {
    console.log('componentDidMount')
    //this.updateMessageState()
    m2.addEventListener('connect', this.handleConnect)
    m2.addEventListener('disconnect', this.handleDisconnect)
    m2.addEventListener('message', this.handleMessage)
    m2.connect()
  }

  // componentDidUpdate(prevProps) {
  //   console.log(`componentDidUpdate: ${this.props.match.params.messagePath}`)
  //   const { categoryPath: prevCategoryPath, messagePath: prevMessagePath } = prevProps.match.params
  //   const { categoryPath, messagePath } = this.props.match.params
  //   if (prevCategoryPath !== categoryPath || prevMessagePath !== messagePath) {
  //     this.updateMessageState()
  //   }
  // }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    m2.removeEventListener('connect', this.handleConnect)
    m2.removeEventListener('disconnect', this.handleDisconnect)
    m2.removeEventListener('message', this.handleMessage)
  }

  handleConnect() {
    console.log('handleConnect')
    m2.disableAllMessages()
    m2.enableMessage(this.getSelectedMessage())
  }

  handleDisconnect() {
    console.log('handleDisconnect')
  }

  handleMessage(event) {
    const { message: eventMessage } = event
    const selectedMessage = this.getSelectedMessage()
    if (eventMessage.id === selectedMessage.id) {
      this.forceUpdate()
    }
  }

  getSelectedMessage() {
    const { categoryPath, messagePath } = this.props.match.params
    const { message } = this.calculateState(categoryPath, messagePath)
    return message
  }

  calculateState = memoizeOne((categoryPath, messagePath) => {
    let category = dbc.getCategory(categoryPath)
    if (!category) {
      category = dbc.getFirstCategory()
    }
    let messages = dbc.getCategoryMessages(categoryPath)
    let message = dbc.getMessageFromPath(categoryPath, messagePath)
    if (!message) {
      message = dbc.getFirstCategoryMessage(categoryPath)
    }
    m2.disableAllMessages()
    m2.enableMessage(message)
    let signals = dbc.getMessageSignals(message)
    return { category, messages, message, signals }
  })

  render() {
    let { match } = this.props
    let { path, params } = match
    let { categoryPath, messagePath } = params
    const url = path.substring(0, path.indexOf(':') - 1)     // url is a base url, without the optional params

    console.log(`render: ${this.props.match.url}`)
    const categories = dbc.getCategories()
    const { category, messages, message, signals } = this.calculateState(categoryPath, messagePath)
    return (
      <div className='SignalBrowser'>
        <Menu fluid vertical>
          {categories.map(c => (
            <Category key={c.path} url={url} category={c} selected={c.path === category.path} />
          ))}
        </Menu>
        <Menu fluid vertical>
          {messages.map(m => (
            <Message key={m.id} url={url} message={m} selected={m.path === message.path} />
          ))}
        </Menu>
        <Segment>
          {signals.map(s => (
            <Signal key={s.mnemonic} signal={s} />
          ))}
        </Segment>
      </div>
    )
    // }

    // // if only the category was passed, redirect to the first message of
    // // that category
    // if (categoryPath && !messagePath) {
    //   const message = dbc.getFirstCategoryMessage(categoryPath)
    //   if (message) {
    //     return (
    //       <Redirect to={`${url}/${categoryPath}/${message.path}`} />
    //     )
    //   }
    // }

    // // if neither category not message was passed in, redirect to the
    // // first message of the first category
    // if (!categoryPath && !messagePath) {
    //   const category = dbc.getFirstCategory()
    //   const message = dbc.getFirstCategoryMessage(category.path)
    //   return (
    //     <Redirect to={`${url}/${category.path}/${message.path}`} />
    //   )
    // }

    // // If we get here, there was an error (probably a hand typed url)
    // return (
    //   <div>Error, unknown category, message, or signal</div>
    // )
  }
}

export default withRouter(SignalBrowser)
