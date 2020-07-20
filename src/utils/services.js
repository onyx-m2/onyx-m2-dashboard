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

export function configure(config) {
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

  cms = axios.create({
    baseURL: `${httpProtocol}://cms.${server}`,
  })
}
