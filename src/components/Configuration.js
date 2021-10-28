import React, { useState, useEffect } from 'react'
import { Tile } from './Base'
import { Button, Header, Form, Checkbox, Segment } from 'semantic-ui-react'
import { save, load } from '../utils/persistance'

export const CONFIG_VERSION = 2

/**
 * @component
 */
export default function Configuration() {
  const [ server, setServer ] = useState(process.env.REACT_APP_CONFIG_SERVER || '')
  const [ pin, setPin ] = useState(process.env.REACT_APP_CONFIG_PIN || '')
  const [ secure, setSecure ] = useState(true)
  const [ ble, setBle ] = useState(false)

  useEffect(() => {
    const config = load('config', CONFIG_VERSION)
    if (config) {
      setServer(config.server)
      setPin(config.pin)
      setSecure(config.secure)
      setBle(config.ble)
    }
  }, [])

  function handleSubmit(event) {
    save('config', CONFIG_VERSION, { server, pin, secure, ble })
    window.location.href = '/'
  }

  return (
      <Tile style={{padding: '20px'}}>
        <Header>CONFIGURATION</Header>

      <Segment basic>
        <Form onSubmit={() => handleSubmit()}>
          <Header size='small'>Server Settings
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
      </Segment>

      <Segment basic>
        <Form>
          <Header size='small'>Bluetooth Settings
            <Header.Subheader>
              These settings allows you to use direct Bluetooth access instead
              of using the relay server.
            </Header.Subheader>
          </Header>
          <Form.Field>
            <Checkbox checked={ble} onChange={(e) => setBle(!ble)} label='Use BLE link' />
          </Form.Field>
          <Button onClick={pairM2}>Pair Now</Button>
        </Form>
      </Segment>
    </Tile>
)
}

// BLE interface
const BLE_SERVICE_NAME = "Onyx M2"
const BLE_SERVICE_UUID = "e9377e45-d4d2-4fdc-9e1c-448d8b4e05d5"

async function pairM2() {
  try {
    await navigator.bluetooth.requestDevice({
      filters: [{
        name: BLE_SERVICE_NAME
      }],
      optionalServices: [BLE_SERVICE_UUID]
    })
  }
  catch (err) {
    alert(`Unable to pair with Onyx M2 device: ${err}`)
  }
}
