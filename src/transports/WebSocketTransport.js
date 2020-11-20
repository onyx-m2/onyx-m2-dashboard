import ReconnectingWebSocket from 'reconnecting-websocket'
import Transport from './Transport'

/**
 * Implements a web socket transport that allows the app to work with the
 * remote m2 server.
 */
export default class WebSocketTransport extends Transport {

  /**
   * Connect to the web socket server using the supplied config, which
   * must include the `server` to connect to, the `pin` for authentication,
   * and a `secure` boolean indicating whether to use a secure connection.
   */
  connect(config) {
    const { server, pin, secure } = config
    const protocol = secure ? 'wss' : 'ws'
    this.ws = new ReconnectingWebSocket(`${protocol}://${server}/dashboard?pin=${pin}`, [], {
      maxReconnectionDelay: 1000
    })
    this.ws.binaryType = 'arraybuffer'
    this.ws.addEventListener('message', (event) => this.handleMessage(event))
  }

  /**
   * Handle a 'message' event from the web socket by unpacking the
   * json encoded encapsulated m2 event and dispatching it to listeners.
   */
  handleMessage(message) {
    try {
      const { event, data } = JSON.parse(message.data)
      this.dispatchEvent(event, data)
    }
    catch (e) {
      throw new Error(`Cannot parse message from M2: ${message.data}. ${e}`)
    }
  }

  /**
   * Reconnect the transport by cycling the connection.
   */
  reconnect() {
    if (this.ws) {
      this.ws.reconnect()
    }
  }

  /**
   * Send an event.
   */
  send(event, data) {
    if (this.ws) {
      this.ws.send(JSON.stringify({ event, data }))
    }
  }

}
