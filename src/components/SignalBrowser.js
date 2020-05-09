import React, { useContext } from 'react'
import { Menu, Segment, Header } from 'semantic-ui-react'
import './SignalBrowser.css'
import Signal from './Signal'
//import DBC from '../services/dbc-old'
import { Link, useParams, useHistory } from 'react-router-dom'
import M2 from '../services/m2'

// Category Component, a canbus category display
// Props:
//   - url: the base url of the signal browser
//   - category: a category object from the dbc
//   - selected: a boolean indicating if the category is currently selected
function Category(props) {
  const { category, selected } = props
  const { path, name } = category
  return (
    <Menu.Item as={Link} to={`../${path}`} active={selected} className='Category'>
      <Header size='tiny' as='h4' color='grey' content={path} />
      {name}
    </Menu.Item>
  )
}

// Message Component, a canbus message display
// Props:
//   - url: the base url of the signal browser
//   - message: a message object from the dbc
//   - selected: a boolean indicating if the message is currently selected
function Message(props) {
  const { message, selected } = props
  const { id, name, path } = message
  return (
    <Menu.Item as={Link} to={`${path}`} active={selected} className='Message'>
      <Header as='h5' size='tiny' color='grey' content={id} />
      {name}
    </Menu.Item>
  )
}

export default function SignalBrowser(props) {
  const { dbc } = useContext(M2)
  const history = useHistory()
  const { categoryPath, messagePath } = useParams()
  let category = dbc.getCategory(categoryPath)
  let message = dbc.getMessageFromPath(categoryPath, messagePath)
  let redirect = false
  if (!category) {
    category = dbc.getFirstCategory()
    redirect = true
  }
  if (!message) {
    message = dbc.getFirstCategoryMessage(category.path)
    redirect = true
  }
  if (redirect) {
    history.replace(`${props.basePath}/${category.path}/${message.path}`)
  }

  const categories = dbc.getCategories()
  let messages = dbc.getCategoryMessages(categoryPath)
  let signals = dbc.getMessageSignals(message.mnemonic)
  return (
    <div className='SignalBrowser'>
      <Menu fluid vertical>
        {categories.map(c => (
          <Category key={c.path} category={c} selected={c.path === category.path} />
        ))}
      </Menu>
      <Menu fluid vertical>
        {messages.map(m => (
          <Message key={m.id} message={m} selected={m.path === message.path} />
        ))}
      </Menu>
      <Segment>
        {signals.map(s => (
          <Signal key={s.mnemonic} mnemonic={s.mnemonic} />
        ))}
      </Segment>
    </div>
  )
}