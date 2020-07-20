import React, { useState } from 'react'
import { Panel } from './Base'
import { Segment, Button, Header, Form, Checkbox } from 'semantic-ui-react'
import { DAY_THEME } from '../theme'
import { save } from '../utils/persistance'

/**
 * @component
 */
export default function Configuration(props) {
  const [ server, setServer ] = useState('')
  const [ pin, setPin ] = useState('')
  const [ secure, setSecure ] = useState(true)

  function handleConfiguration(event) {
    save('config', 1, { server, pin, secure })
    window.location.reload(false);
  }

  return (
    <Panel theme={DAY_THEME}>
      <Segment style={{width: 'fit-content'}}>
          <Header>One Time Configuration</Header>
        <Form onSubmit={() => handleConfiguration()}>
          <Form.Field>
            <label>M2 Server</label>
            <input value={server} onChange={(e) => setServer(e.target.value)} placeholder='Enter hostname' />
          </Form.Field>
          <Form.Field>
            <label>M2 PIN</label>
            <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder='Enter pin code used by server' />
          </Form.Field>
          <Form.Field>
            <Checkbox value={secure} onChange={(e) => setSecure(e.target.value)} label='Use secure connection (usually required)' />
          </Form.Field>
          <Button primary type='submit'>Continue</Button>
        </Form>
      </Segment>
    </Panel>
  )
}
