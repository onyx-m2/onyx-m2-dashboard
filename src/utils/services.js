import axios from 'axios'
import ReconnectingWebSocket from 'reconnecting-websocket'

const m2Hostname = process.env.REACT_APP_M2_HOSTNAME
const m2Authorization = process.env.REACT_APP_M2_AUTHORIZATION
const m2Secure = process.env.REACT_APP_M2_SECURE === 'true'
const m2Scheme = m2Secure ? 'https' : 'http'
const m2WsScheme = m2Secure ? 'wss' : 'ws'

/**
 * M2 websocket
 */
export const ws = new ReconnectingWebSocket(`${m2WsScheme}://${m2Hostname}/dashboard?pin=${m2Authorization}`, [], {
  maxReconnectionDelay: 1000
})
ws.binaryType = 'arraybuffer'

/**
 * M2 server API
 */
export const m2 = axios.create({
  baseURL: `${m2Scheme}://${m2Hostname}`,
  headers: {
    'Authorization': m2Authorization
  }
})

/**
 * CMS API
 */
export const cms = axios.create({
  baseURL: `${m2Scheme}://cms.${m2Hostname}`,
})
