import M2 from '../utils/M2'
import { BitView } from 'bit-buffer'
import Transport from './Transport'

const log = console
var m2 = null

/**
 * Implements a native transport that leverages a natively inject mechanism for
 * communicating with the m2 device. This only works if running in a web view on a real
 * device that has Bluetooth access to the m2 device. The details of this native
 * interface are handle by the M2 class (in ./utils).
 */
export default class NativeTransport extends Transport {

  /**
   * Construct a native
   */
  constructor(dbc) {
    super()
    if (m2 == null) {
      m2 = new M2()
    }
    this.dbc = dbc

    // is the M2 currently connected?
    this.connected = false

    // synthetic session number to mimic the websocket transport, this will be incremented
    // with every reconnect
    this.sessionNumber = 1

    // list of signal subscriptions
    this.subscriptions = []

    // list of signals to send only once
    this.oneShotSignals = []

    // a map of how many signals require a given message
    this.signalEnabledMessageRefs = {}

    // subscribe to m2 events
    m2.addEventListener((event) => this.handleM2(event))
  }

  /**
   * Send an event to the M2. These are the same high-level events that the server
   * supports.
   *
   * Note that a number of event types are not implemented (yet?) in direct mode. These
   * are mostly those that exist for the diagnostic tools.
   */
  send(event, data) {
    switch (event) {

      // handle pings by immediately sending a pong; this'll simulate a zero latency
      // connection with the server
      case 'ping':
        this.dispatchEvent('pong')
        break

      case 'subscribe':
        this.subscribe(data)
        break

      case 'unsubscribe':
        this.unsubscribe(data)
        break

      case 'get':
        this.oneShotSignals.push(...data)
        this.getLastSignalValues(data)
        break

      default:
        log.warn(`Ignoring request to send event ${event} to m2`)
    }
  }

  /**
   * Handle events from M2 by unpacking them and dispatching them to the listeners.
   * There is also additional processing that happens on 'status' and 'message' events.
   */
  handleM2({ detail: { event, data }}) {
    if (event === 'status') {
      this.handleStatus(data)
    }
    if (event === 'message') {
      this.handleMessage(data)
    }
    this.dispatchEvent(event, data)
  }

  /**
   * Handle status changes from M2 on re-connections by re-enabling the subscribed
   * messages in case the connectivity issue was caused by M2 resetting (and thus
   * loosing its state).
   */
  handleStatus([ newConnectedStatus ]) {
    const previousConnectedStatus = this.connected
    this.connected = newConnectedStatus
    if (newConnectedStatus && !previousConnectedStatus) {
      this.enableAllSubscribedMessages()
    }
  }

  /**
   * Handle messages from M2 by performing the signal parsing the server would normally
   * do and dispatching 'signal' events to listeners.
   */
  handleMessage([ ts, bus, id, data ]) {
    const bits = new BitView(Uint8Array.from(data).buffer)
    const def = this.dbc.getMessageFromId(bus, id)
    if (!def) {
      return log.warn(`No definition for message ${id} on bus ${bus}`)
    }
    const ingress = {}
    if (def.signals) {
      def.signals.forEach(s => {
        ingress[s.mnemonic] = this.dbc.decodeSignal(bits, s)
      })
    }
    if (def.multiplexor) {
      const multiplexId = ingress[def.multiplexor.mnemonic] = this.dbc.decodeSignal(bits, def.multiplexor)
      const multiplexed = def.multiplexed[multiplexId]
      if (multiplexed) {
        multiplexed.forEach(s => {
          ingress[s.mnemonic] = this.dbc.decodeSignal(bits, s)
        })
      } else {
        log.warn(`Message ${def.mnemonic} doesn't have a multiplexed signal for ${multiplexId}`)
      }
    }
    const subscribedSignals = this.subscriptions.filter(s => s in ingress)
    const oneShotSignals = this.oneShotSignals.filter(s => s in ingress)
    const signals = [...new Set([...subscribedSignals, ...oneShotSignals])].map(s => [s, ingress[s]])
    if (signals.length > 0) {
      this.dispatchEvent('signal', signals)
    }
    this.oneShotSignals = this.oneShotSignals.filter(s => !oneShotSignals.includes(s))
  }

  // TODO: Most of the functions below are lifted verbatim from the server code. Make
  // a shared package?

  /**
   * Subscribe to a series of signals. The app should ensure it doesn't double subscribe
   * to any given signal.
   */
  subscribe(signals) {
    signals.forEach(signal => {
      this.subscriptions.push(signal)
      this.addSignalMessageRef(signal)
    })
    this.getLastSignalValues(signals)
  }

  /**
   * Unsubscribe to a series of signals.
   */
  unsubscribe(signals) {
    signals.forEach(signal => {
      const index = this.subscriptions.indexOf(signal)
      if (index > -1) {
        this.subscriptions.splice(index, 1)
        this.releaseSignalMessageRef(signal)
      }
    })
  }

  addSignalMessageRef(signal) {
    const message = this.dbc.getSignalMessage(signal)
    if (!message) {
      return log.warn(`Attempting to subscribe to nonexistent signal ${signal}`)
    }
    let refs = this.signalEnabledMessageRefs[message.mnemonic] || 0
    if (refs === 0 && this.connected) {
      m2.enableMessage(message.bus, message.id)
    }
    this.signalEnabledMessageRefs[message.mnemonic] = refs + 1
  }

  releaseSignalMessageRef(signal) {
    const message = this.dbc.getSignalMessage(signal)
    if (!message) {
      log.warn(`Attempting to unsubscribe from nonexistent signal ${signal}`)
      return
    }
    let refs = this.signalEnabledMessageRefs[message.mnemonic] || 0
    if (refs > 0) {
      if (refs === 1 && this.connected) {
        m2.disableMessage(message.bus, message.id)
      }
      this.signalEnabledMessageRefs[message.mnemonic] = refs - 1
    }
  }

  enableAllSubscribedMessages() {
    log.debug(`Enabling all subscribed messages`)
    Object.keys(this.signalEnabledMessageRefs).forEach(mnemonic => {
      log.debug(`Enabling message ${mnemonic}, has ${this.signalEnabledMessageRefs[mnemonic]} signals`)
      const message = this.dbc.getMessage(mnemonic)
      m2.getLastMessageValue(message.bus, message.id)
      m2.enableMessage(message.bus, message.id)
    })
  }

  getLastSignalValues(signals) {
    if (this.connected) {
      const messages = [...new Set(signals.map(s => this.dbc.getSignalMessage(s)))]
      messages.forEach(m => m2.getLastMessageValue(m.bus, m.id))
    }
  }

}
