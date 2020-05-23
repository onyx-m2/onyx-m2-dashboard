import M2 from './M2'
import React, { createContext, useContext, useEffect, useState } from 'react'

export const SignalContext = createContext()

/**
 * Context provider that gives access to `subscribe` and `unsubscribe` functions for
 * hooking into realtime signal value updates.
 * @param {*} props
 */
export function SignalProvider(props) {
  const { children } = props
  const { dbc, send, listeners } = useContext(M2)
  if (!listeners) {
    throw new Error('M2Provider is missing in render tree')
  }

  const allSignalsListeners = {}

  function subscribe(mnemonic, handler) {
    let signalListeners = allSignalsListeners[mnemonic]
    if (!signalListeners) {
      signalListeners = allSignalsListeners[mnemonic] = []
    }
    if (signalListeners.length === 0) {
      send('subscribe', [mnemonic])
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
        send('unsubscribe', [mnemonic])
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
    listeners.addEventListener('signal', handleSignal)
    return () => listeners.removeEventListener('signal', handleSignal)
  }, [dbc])

  // handle reconnects by re-subscribing to the signals we require
  useEffect(() => {
    function handleHello() {
      const signals = Object.keys(allSignalsListeners)
      send('subscribe', signals)
    }
    listeners.addEventListener('hello', handleHello)

    return () => listeners.removeEventListener('hello', handleHello)
  }, [dbc])

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
      if (newValue !== value) {
        setValue(newValue)
      }
    }
    subscribe(mnemonic, handleSignal)
    return () => unsubscribe(mnemonic, handleSignal)
  }, [mnemonic])
  return value
}
