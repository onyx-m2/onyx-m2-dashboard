import React from 'react'
import PropTypes from 'prop-types'
import './ConnectionPopup.css'
import { Message, Icon } from 'semantic-ui-react'
import { m2 } from '../utils/services'

/**
 * Component that flashes a floating message when there connection issues.
 * @component
 */
export default function ConnectionPopup(props) {
  const { appStatus, m2Status } = props

  if (!appStatus) {
    return (
      <Message color='black' icon floating className='ConnectionPopup'>
        <LoadingIcon icon='image' />
        <DisabledIcon icon='car' />
        <Message.Content>
          <Message.Header>Reconnecting</Message.Header>
          One moment please
        </Message.Content>
      </Message>
    )
  }

  if (!m2Status) {
    return (
      <Message color='black' icon floating className='ConnectionPopup' onClick={() => m2.post('/tesla/wakeup')}>
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

ConnectionPopup.propTypes = {
  /**
   * Indicates whether the app is online (can reach the M2 server)
   */
  appStatus: PropTypes.bool.isRequired,

  /**
   * Indicates whether M2 is online (i.e. the M2 is able to reach the M2 server)
   */
  m2Status: PropTypes.bool.isRequired
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
