import React, { Component } from 'react'
import { Menu, Segment, Header } from 'semantic-ui-react'
import './SignalBrowser.css'
import Signal from './Signal'
import DBC from '../services/dbc'
import M2 from '../services/m2'
import { Link, withRouter } from 'react-router-dom'
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
    super(props)
    this.state = {}
    this.handleConnect = this.handleConnect.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }


  componentDidMount() {
    M2.addEventListener('connect', this.handleConnect)
    M2.addEventListener('disconnect', this.handleDisconnect)
    M2.connect()
  }

  componentWillUnmount() {
    M2.removeEventListener('connect', this.handleConnect)
    M2.removeEventListener('disconnect', this.handleDisconnect)
  }

  handleConnect() {
  }

  handleDisconnect() {
  }

  calculateState = memoizeOne((categoryPath, messagePath) => {
    let category = DBC.getCategory(categoryPath)
    if (!category) {
      category = DBC.getFirstCategory()
    }
    let messages = DBC.getCategoryMessages(categoryPath)
    let message = DBC.getMessageFromPath(categoryPath, messagePath)
    if (!message) {
      message = DBC.getFirstCategoryMessage(categoryPath)
    }
    let signals = DBC.getMessageSignals(message)
    return { category, messages, message, signals }
  })

  render() {
    let { match } = this.props
    let { path, params } = match
    let { categoryPath, messagePath } = params
    const url = path.substring(0, path.indexOf(':') - 1)     // url is a base url, without the optional params

    const categories = DBC.getCategories()
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
            <Signal key={s.mnemonic} signal={s.mnemonic} />
          ))}
        </Segment>
      </div>
    )
  }
}

export default withRouter(SignalBrowser)
