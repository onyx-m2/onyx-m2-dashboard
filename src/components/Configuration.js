import React, { useState, useEffect } from 'react'
import { Tile } from './Base'
import { Button, Header, Form, Checkbox } from 'semantic-ui-react'
import { save, load } from '../utils/persistance'

/**
 * @component
 */
export default function Configuration() {
  const [ server, setServer ] = useState('')
  const [ pin, setPin ] = useState('')
  const [ secure, setSecure ] = useState(true)
  const [ cmsServer, setCmsServer ] = useState('cms.onyx-m2.net')
  const [ cmsUsername, setCmsUsername ] = useState('')
  const [ cmsPassword, setCmsPassword ] = useState('')

  useEffect(() => {
    const config = load('config', 1)
    if (config) {
      setServer(config.server)
      setPin(config.pin)
      setSecure(config.secure)
      setCmsServer(config.cms?.server)
      setCmsUsername(config.cms?.username)
      setCmsPassword(config.cms?.password)
    }
  }, [])

  function handleSubmit(event) {
    save('config', 1, {
      server, pin, secure,
      cms: {
        server: cmsServer,
        username: cmsUsername,
        password: cmsPassword
      }
     })
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
          <Header size='small'>CMS Settings
            <Header.Subheader>
              These settings indicate where your content management server is located, and optionally
              your credentials for authenticated access. The credential fields may be left blank for
              anonymous access. It is also fine to use the default CMS hosted at cms.onyx-m2.net.
            </Header.Subheader>
          </Header>
          <Form.Field>
            <label>Server</label>
            <input value={cmsServer} onChange={(e) => setCmsServer(e.target.value)} placeholder='Enter cms hostname' />
          </Form.Field>
          <Form.Field>
            <label>Username (Optional)</label>
            <input value={cmsUsername} onChange={(e) => setCmsUsername(e.target.value)} placeholder='Enter cms username or leave blank' />
          </Form.Field>
          <Form.Field>
            <label>Password (Optional)</label>
            <input value={cmsPassword} onChange={(e) => setCmsPassword(e.target.value)} type='password' placeholder='Enter cms password or leave blank' />
          </Form.Field>
          <Button primary type='submit'>Continue</Button>
        </Form>
      </Tile>
  )
}
