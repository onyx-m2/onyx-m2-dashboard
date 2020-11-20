/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "CAN_MSG_FLAG_TRANSMIT_UNMODIFIED" }]*/

const CAN_MSG_FLAG_RESET = 0x00
const CAN_MSG_FLAG_TRANSMIT = 0x01
const CAN_MSG_FLAG_TRANSMIT_UNMODIFIED = 0x02
const CMDID_SET_ALL_MSG_FLAGS = 0x01
const CMDID_SET_MSG_FLAGS = 0x02
const CMDID_GET_MSG_LAST_VALUE = 0x03
const CMDID_GET_ALL_MSG_LAST_VALUE = 0x04

/**
 * Implements the direct M2 low-level interface. Allows listening for 'm2' events,
 * and sending commands to the m2.
 *
 * TODO: Almost 100% of this code was directly lifted from server code, so it
 * Would be really nice to actually share the code, but how?
 */
export default class M2 {

  constructor() {
    if (!global.M2) {
      throw new Error('Direct M2 interface requires native fixtures')
    }
  }

  addEventListener(listener) {
    global.addEventListener('m2', listener)
  }

  removeEventListener(listener) {
    global.removeEventListener('m2', listener)
  }

  send(command) {
    global.M2.sendCommand(JSON.stringify(command))
  }

  getAllLastMessageValues() {
    const size = 0
    this.send([CMDID_GET_ALL_MSG_LAST_VALUE, size])
  }

  getLastMessageValue(bus, id) {
    const size = 3
    this.send([CMDID_GET_MSG_LAST_VALUE, size, bus, id & 0xff, id >> 8])
  }

  setAllMessageFlags(flags) {
    const size = 1
    this.send([CMDID_SET_ALL_MSG_FLAGS, size, flags & 0xff])
  }

  setMessageFlags(bus, id, flags) {
    const size = 4
    this.send([CMDID_SET_MSG_FLAGS, size, bus, id & 0xff, id >> 8, flags & 0xff])
  }

  enableAllMessages() {
    this.setAllMessageFlags(CAN_MSG_FLAG_TRANSMIT)
  }

  disableAllMessages() {
    this.setAllMessageFlags(CAN_MSG_FLAG_RESET)
  }

  enableMessage(bus, id) {
    this.setMessageFlags(bus, id, CAN_MSG_FLAG_TRANSMIT)
  }

  disableMessage(bus, id) {
    this.setMessageFlags(bus, id, CAN_MSG_FLAG_RESET)
  }

}
