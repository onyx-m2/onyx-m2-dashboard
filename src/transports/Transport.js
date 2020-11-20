/**
 * Defines the transport abstraction, and implements behaviours common to all
 * transports.
 */
export default class Transport {

  /**
   * Construct a base transport, which must be subclassed to provide a concrete
   * transport mechanism.
   */
  constructor() {

    // our m2 event listeners
    this.listeners = new EventTarget()

    // a flag and a queue for supporting paused mode
    this.paused = false
    this.eventQ = []
  }

  /**
   * Connect the transport, passing in an implementation specific config. Optional
   * for subclasses.
   */
  connect(config) {
  }

  /**
   * Listen for the specified `event` and notify caller by invoking
   * `listener`.
   */
  addEventListener(event, listener)   {
    this.listeners.addEventListener(event, listener)
  }

  /**
   * Remove the listener identified by the `event` and `listener`.
   */
  removeEventListener(event, listener)   {
    this.listeners.removeEventListener(event, listener)
  }

  /**
   * Reconnect the transport. This exists for stale connection detection, and the base
   * class version does nothing.
   */
  reconnect() {
  }

  /**
   * Send an event to the M2. These are the same high-level events that the server
   * supports. Needs to be implemented by subclasses.
   */
  send(event, data) {
    throw new Error('Transport.send() must be implemented by subclasses')
  }

  /**
   * Pause a transport. All events will be held until resume() is called.
   */
  pause() {
    this.paused = true
  }

  /**
   * Resume a paused transport, and drain the events that accumulated while the
   * transport was paused.
   */
  resume() {
    this.paused = false
    while (this.eventQ.length > 0) {
      this.dispatchEvent(this.eventQ.shift())
    }
  }

  /**
   * Dispatch the specified m2 event to listeners, queuing the event if the transport
   * is currently paused.
   */
  dispatchEvent(event, data) {
    if (this.paused) {
      return this.eventQ.push({ event, data })
    }
    this.listeners.dispatchEvent(new CustomEvent(event, { detail: data }))
  }

}