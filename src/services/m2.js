import { BitView } from 'bit-buffer'
import DBC from './dbc'

const CAN_MSG_FLAG_RESET = 0x00
const CAN_MSG_FLAG_TRANSMIT = 0x01

const CMDID_SET_ALL_MSG_FLAGS = 0x01
const CMDID_SET_MSG_FLAGS = 0x02
const CMDID_GET_MSG_LAST_VALUE = 0x03

var ws = null
var wsConnected = false
var m2Connected = false
var m2EventTarget = new EventTarget()
var signalListeners = []
var signalEnabledMessageRefs = {} // a map of how many signals require a given message

export default class M2 {

  static addEventListener(event, listener) {
    m2EventTarget.addEventListener(event, listener)
  }

  static removeEventListener(event, listener) {
    m2EventTarget.removeEventListener(event, listener)
  }

  static connect() {
    const pin = process.env.REACT_APP_M2_PIN
    const url = process.env.REACT_APP_M2_URL
    ws = new WebSocket(`${url}?pin=${pin}`)
    ws.binaryType = 'arraybuffer'
    ws.addEventListener('open', () => {
      wsConnected = true
    })
    ws.addEventListener('close', (event) => {
      wsConnected = false
      if (m2Connected) {
        m2Connected = false
        m2EventTarget.dispatchEvent(new DisconnectEvent('network'))
      }
    })
    ws.addEventListener('message', (event) => {
      if (typeof(event.data) === 'string') {
        const msg = event.data
        if (msg === 'm2:connect') {
          m2Connected = true
          m2EventTarget.dispatchEvent(new ConnectEvent())
          this.enableMessages(Object.keys(signalEnabledMessageRefs).map(x => DBC.getMessage(x)))
        }
        else if (msg === "m2:disconnect") {
          m2Connected = false
          m2EventTarget.dispatchEvent(new DisconnectEvent('device'))
        }
      }
      else {
        const eventData = new Uint8Array(event.data)
        if (eventData.length >= 7) {
          const message = processMessage(eventData)
          if (message) {
            m2EventTarget.dispatchEvent(new MessageEvent(message))
          }
        }
      }
    })
  }

  static requestMessageValue(message) {
    if (wsConnected) {
      const size = 2
      const { id } = message
      ws.send(Uint8Array.from([CMDID_GET_MSG_LAST_VALUE, size, id & 0xff, id >> 8]))
    }
  }

  static enableAllMessages() {
    setAllMessageFlags(CAN_MSG_FLAG_TRANSMIT)
  }

  static disableAllMessages() {
    setAllMessageFlags(CAN_MSG_FLAG_RESET)
  }

  static enableMessage(message) {
    this.requestMessageValue(message)
    setMessageFlags(message.id, CAN_MSG_FLAG_TRANSMIT)
  }

  static disableMessage(message) {
    setMessageFlags(message.id, CAN_MSG_FLAG_RESET)
  }

  static enableMessages(messages) {
    const mnemonics = [...new Set(messages)]
    mnemonics.forEach(m => this.enableMessage(m))
  }

  static enableSignals(signals) {
    signals = [...new Set(signals)]
    this.enableMessages(signals.map(s => s.message))
  }

  static addSignalListener(signal, listener) {
    let listeners = signalListeners[signal.mnemonic]
    if (!listeners) {
      listeners = signalListeners[signal.mnemonic] = []
    }
    listeners.push(listener)
    addSignalMessageRef(signal)
  }

  static removeSignalListener(signal, listener) {
    const listeners = signalListeners[signal.mnemonic]
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
      releaseSignalMessageRef(signal)
    }
  }
}

function addSignalMessageRef(signal) {
  let refs = signalEnabledMessageRefs[signal.message.mnemonic] || 0
  if (refs === 0) {
    M2.enableMessage(signal.message)
  }
  signalEnabledMessageRefs[signal.message.mnemonic] = refs + 1
}

function releaseSignalMessageRef(signal) {
  let refs = signalEnabledMessageRefs[signal.message.mnemonic] || 0
  if (refs > 0) {
    if (refs === 1) {
      M2.disableMessage(signal.message)
    }
    signalEnabledMessageRefs[signal.message.mnemonic] = refs - 1
  }
}

function dispatchSignalEvent(signal) {
  const listeners = signalListeners[signal.mnemonic]
  if (listeners) {
    const { value } = signal
    listeners.forEach(l => l(value))
  }
}

function processMessage(msg) {
  const ts = msg[0] | (msg[1] << 8) | (msg[2] << 16) | (msg[3] << 24)
  const id = msg[4] | (msg[5] << 8)
  const len = msg[6]
  const data = msg.slice(7, 7 + len)

  const message = DBC.getMessageFromId(id)
  if (message) {
    message.ts = ts
    message.value = data
    const buf = new BitView(data.buffer)
    if (message.signals) {
      processSignals(buf, message.signals)
    }
    const mp = message.multiplexor
    if (mp) {
      const id = message.multiplexor.value = buf.getBits(mp.start, mp.length, mp.signed)
      const multiplexed = message.multiplexed[id]
      if (multiplexed) {
        processSignals(buf, multiplexed)
      }
      else {
        console.log(`Unknown multiplexed signal for ${message.mnemonic}: ${id}`)
      }
    }
  }
  else {
    DBC.addMessage({
      id,
      mnemonic: `UNK_id${id}`,
      category: 'unk',
      path: 'id',
      name: id.toString(),
      length: len,
      value: data
    })
  }
  return message
}

function processSignals(buf, signals) {
  signals.forEach(s => {
    var value
    try {
      value = buf.getBits(s.start, s.length, s.signed)
      value = s.offset + s.scale * value
      s.value = Math.round(value * 100) / 100
      dispatchSignalEvent(s)
    } catch {
      s.value = 'ERR'
    }
  })
}

function setAllMessageFlags(flags) {
  if (wsConnected) {
    const size = 1
    ws.send(Uint8Array.from([CMDID_SET_ALL_MSG_FLAGS, size, flags & 0xff]))
  }
}

function setMessageFlags(id, flags) {
  if (wsConnected) {
    const size = 3
    ws.send(Uint8Array.from([CMDID_SET_MSG_FLAGS, size, id & 0xff, id >> 8, flags & 0xff]))
  }
}

class ConnectEvent extends Event {
  constructor() {
    super('connect')
  }
}

class MessageEvent extends Event {
  constructor(message) {
    super('message')
    this.message = message
  }
}

class DisconnectEvent extends Event {
  constructor(reason) {
    super('disconnect')
    this.reason = reason
  }
}
