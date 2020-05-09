import M2 from './m2'
import React, { createContext, useContext, useEffect, useState } from 'react'

export const SignalContext = createContext()

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
      send('subscribe', mnemonic)
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
        send('unsubscribe', mnemonic)
      }
    }
  }

  useEffect(() => {
    function handleSignal(event) {
      const { mnemonic, value } = event.detail
      for (let i in allSignalsListeners[mnemonic]) {
        const handler = allSignalsListeners[mnemonic][i]
        handler(value)
      }
    }
    listeners.addEventListener('signal', handleSignal)
    return () => listeners.removeEventListener('signal', handleSignal)
  }, [dbc])

  return (
    <SignalContext.Provider value={{ subscribe, unsubscribe }}>
      {children}
    </SignalContext.Provider>
  )
}

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

// function addListener(allListeners, mnemonic) {
//   let listeners = allListeners[mnemonic]
//   if (!listeners) {
//     listeners = allListeners[mnemonic] = []
//   }
//   listeners.push(listener)
//   addSignalMessageRef(signal)
// }

// function removeSignalListener(signal, listener) {
//   const listeners = signalListeners[signal.mnemonic]
//   if (listeners) {
//     const index = listeners.indexOf(listener)
//     if (index !== -1) {
//       listeners.splice(index, 1)
//     }
//     releaseSignalMessageRef(signal)
//   }
// }

// function addSignalMessageRef(signal) {
//   let refs = signalEnabledMessageRefs[signal.message.mnemonic] || 0
//   if (refs === 0) {
//     M2.enableMessage(signal.message)
//   }
//   signalEnabledMessageRefs[signal.message.mnemonic] = refs + 1
// }

// function releaseSignalMessageRef(signal) {
//   let refs = signalEnabledMessageRefs[signal.message.mnemonic] || 0
//   if (refs > 0) {
//     if (refs === 1) {
//       M2.disableMessage(signal.message)
//     }
//     signalEnabledMessageRefs[signal.message.mnemonic] = refs - 1
//   }
// }
