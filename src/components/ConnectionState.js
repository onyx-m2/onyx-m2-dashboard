import React, { useEffect, useState } from 'react'
import './ConnectionState.css'
import { Message, Icon } from 'semantic-ui-react'

// Signal Component, a realtime canbus signal display
// Props:
//   - mnemonic: the mnemonic of the signal to display
export default function ConnectionPopup(props) {
  const { app, m2 } = props
  console.log(`app: ${app}, m2: ${m2}`)

  if (!app) {
    return (
      <Message color='black' icon floating className='ConnectionState'>
        <LoadingIcon icon='image' />
        <DisabledIcon icon='car' />
        <Message.Content>
          <Message.Header>Reconnecting</Message.Header>
          One moment please
        </Message.Content>
      </Message>
    )
  }

  if (!m2) {
    return (
      <Message color='black' icon floating className='ConnectionState'>
        <SuccessIcon icon='image' />
        <LoadingIcon icon='car' />
        <Message.Content>
          <Message.Header>Reconnecting</Message.Header>
          One moment please
        </Message.Content>
      </Message>
    )
  }

  return (null)
}

function LoadingIcon(props) {
  const { icon } = props
  return (
    <Icon.Group size='huge'>
      <Icon name='circle notched' color='orange' loading />
      <Icon size='tiny' name={icon} color='orange' />
    </Icon.Group>
  )
}

function SuccessIcon(props) {
  const { icon } = props
  return (
    <Icon.Group size='huge'>
      <Icon name='circle outline' color='olive' />
      <Icon size='tiny' name={icon} color='olive' />
    </Icon.Group>
  )
}

function DisabledIcon(props) {
  const { icon } = props
  return (
    <Icon.Group size='huge'>
      <Icon name='circle outline' color='grey' />
      <Icon size='tiny' name={icon} color='grey' />
    </Icon.Group>
  )
}
