import M2 from './M2'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

export const SignalContext = createContext()

/**
 * Context provider that gives access to `subscribe` and `unsubscribe` functions for
 * hooking into realtime signal value updates.
 * @param {*} props
 */
export function SignalProvider(props) {
  const { children } = props
  const { transport } = useContext(M2)
  if (!transport) {
    throw new Error('M2Provider is missing in render tree')
  }

  const allSignalsListeners = {}

  function subscribe(mnemonic, handler) {
    let signalListeners = allSignalsListeners[mnemonic]
    if (!signalListeners) {
      signalListeners = allSignalsListeners[mnemonic] = []
    }
    if (signalListeners.length === 0) {
      transport.send('subscribe', [mnemonic])
    }
    signalListeners.push(handler)
  }

  function unsubscribe(mnemonic, handler) {
    const signalListeners = allSignalsListeners[mnemonic]
    if (signalListeners) {
      const index = signalListeners.indexOf(handler)
      if (index !== -1) {
        signalListeners.splice(index, 1)
      }
      if (signalListeners.length === 0) {
        transport.send('unsubscribe', [mnemonic])
        delete allSignalsListeners[mnemonic]
      }
    }
  }

  // handle ingress signals by dispatching them to the listeners
  useEffect(() => {
    function handleSignal(event) {
      event.detail.forEach(([ mnemonic, value ]) => {
        for (let i in allSignalsListeners[mnemonic]) {
          const handler = allSignalsListeners[mnemonic][i]
          handler(value)
        }
      })
    }
    transport.addEventListener('signal', handleSignal)
    return () => transport.removeEventListener('signal', handleSignal)
  }, [transport])

  // handle reconnects by re-subscribing to the signals we require
  useEffect(() => {
    function handleHello() {
      const signals = Object.keys(allSignalsListeners)
      transport.send('subscribe', signals)
    }
    transport.addEventListener('hello', handleHello)

    return () => transport.removeEventListener('hello', handleHello)
  }, [transport])

  return (
    <SignalContext.Provider value={{ subscribe, unsubscribe }}>
      {children}
    </SignalContext.Provider>
  )
}

/**
 * State hook that provides the realtime value of the specified signal. Requires
 * `SignalProvider` to be present in the render tree.
 * @param {String} mnemonic Mnemonic of the signal to subscribe to
 * @param {*} initialValue Initial value to return while the signal has no value
 */
export function useSignalState(mnemonic, initialValue) {
  const { subscribe, unsubscribe } = useContext(SignalContext)
  const [ value, setValue ] = useState(initialValue)
  useEffect(() => {
    function handleSignal(newValue) {
      setValue(newValue)
    }
    subscribe(mnemonic, handleSignal)
    return () => unsubscribe(mnemonic, handleSignal)
  }, [subscribe, unsubscribe, mnemonic])
  return value
}

/**
 *
 * @param {*} mnemonic
 * @param {*} decimals
 */
export function useSignalDisplay(mnemonic, decimals) {
  decimals = decimals === undefined ? 2 : decimals

  const { dbc } = useContext(M2)
  const signalValue = useSignalState(mnemonic, '--')

  let value = signalValue
  if (typeof(value) === 'number') {
    const factor = Math.pow(10, decimals)
    value = Math.round(value * factor) / factor
  }

  const definition = dbc.getSignal(mnemonic)
  let units = 'N/A'
  let name = mnemonic
  if (definition) {
    name = definition.name
    units = definition.units
    if (definition.values) {
      const definedValue = definition.values[value]
      if (definedValue) {
        units = definedValue.replace(/_/g, ' ')
      }
    }
  }
  return { name, value, units }
}

/**
 *
 * @param {*} mnemonic
 * @param {*} initialValue
 */
export function useNamedValuesSignalState(mnemonic, initialValue) {
  const { dbc } = useContext(M2)
  const definition = dbc.getSignal(mnemonic)
  const state = useSignalState(mnemonic, definition.namedValues[initialValue])
  return [ state, definition.namedValues ]
}


/**
 * Hook that provides hotkey simulation for signals. The idea is to use this to
 * test applications without having to test everything in car to get the signal
 * values to change.
 *
 * The simulation works by associating a hotkey with a specific signal and value.
 * Hitting the hotkey will call the listeners is the same way a real signal
 * would.
 *
 *  TODO: update docs now that it's the signal format
 *
 * The config is an array of arrays, the latter of which containing, in order:
 * 1. the key that should trigger the signal
 * 2. the mnemonic of the signal to trigger
 * 3. the value to set the signal to, which can be blank to have the
 *   simulation send a random value (but in range)
 *
 * For example, to setup a simulation to turn on the display with the 'd' key:
 * ```
 * useSignalHotkeySimulation([
 *   ['d', [['UI_displayOn', 1]]
 * ])
 * ```
 * @param {*} config
 */
export function useSignalHotkeySimulation(config) {
  const { dbc, listeners } = useContext(M2)
  const hotkeys = Object.keys(config).join()

  useHotkeys(hotkeys, (_, ev) => {
    const detail = config[ev.key].map(kv => (typeof kv[1] === 'string') ?
      [kv[0], dbc.getSignal(kv[0]).namedValues[kv[1]]] : kv)

    listeners.dispatchEvent(new CustomEvent('signal', {detail}))
  })
}


