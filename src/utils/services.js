import axios from 'axios'
import ReconnectingWebSocket from 'reconnecting-websocket'

/**
 * M2 websocket
 * Send and receive realtime M2 messages
 */
export var ws

/**
 * M2 server API
 * CRUS access to data stored on the server
 */
export var m2

/**
 * CMS API
 * Get and update content for the dashboard
 */
export var cms

export async function configure(config) {
  const { server, pin, secure } = config
  const httpProtocol = secure ? 'https' : 'http'
  const wsProtocol = secure ? 'wss' : 'ws'

  ws = new ReconnectingWebSocket(`${wsProtocol}://${server}/dashboard?pin=${pin}`, [], {
    maxReconnectionDelay: 1000
  })
  ws.binaryType = 'arraybuffer'

  m2 = axios.create({
    baseURL: `${httpProtocol}://${server}`,
    headers: {
      'Authorization': pin
    }
  })

  const cmsServer = config.cms.server || `cms.${server}`
  const cmsUrl = `${httpProtocol}://${cmsServer}`
  if (config.cms.username && config.cms.password) {
    const { data: { jwt } } = await axios.post(`${cmsUrl}/auth/local`, {
      identifier: config.cms.username,
      password: config.cms.password
    })
    cms = axios.create({
      baseURL: cmsUrl,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
  }
  else {
    cms = axios.create({ baseURL: cmsUrl })
  }
}
