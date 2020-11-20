import React, { useState, useEffect } from 'react'
import { Tile } from './Base'
import { Button, Header, Form, Checkbox } from 'semantic-ui-react'
import { save, load } from '../utils/persistance'

/**
 * @component
 */
export default function Configuration() {
  const [ server, setServer ] = useState(process.env.REACT_APP_CONFIG_SERVER || '')
  const [ pin, setPin ] = useState(process.env.REACT_APP_CONFIG_PIN || '')
  const [ secure, setSecure ] = useState(true)

  useEffect(() => {
    const config = load('config', 1)
    if (config) {
      setServer(config.server)
      setPin(config.pin)
      setSecure(config.secure)
    }
  }, [])

  function handleSubmit(event) {
    save('config', 1, { server, pin, secure })
    window.location.href = '/'
  }

  return (
      <Tile style={{padding: '20px'}}>
        <Header>CONFIGURATION</Header>
        <Form onSubmit={() => handleSubmit()}>
          <Header size='small'>M2 Settings
            <Header.Subheader>
              These settings indicate where your M2 server is located and the pin code
              used for access control
            </Header.Subheader>
          </Header>
          <Form.Field>
            <label>Server</label>
            <input value={server} onChange={(e) => setServer(e.target.value)} placeholder='Enter hostname' />
          </Form.Field>
          <Form.Field>
            <label>PIN</label>
            <input value={pin} onChange={(e) => setPin(e.target.value)} type='password' placeholder='Enter pin code' />
          </Form.Field>
          <Form.Field>
            <Checkbox checked={secure} onChange={(e) => setSecure(!secure)} label='Use secure connection (usually required)' />
          </Form.Field>
          <Button primary type='submit'>Continue</Button>
        </Form>
      </Tile>
  )
}
