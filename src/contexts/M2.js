import React, { createContext, useEffect, useContext, useState } from 'react'
import { ws } from '../utils/services'

const M2 = createContext()
export default M2

/**
 * Context provider for the M2, which must be present in the render tree above the
 * App component.
 * @param {*} props
 */
export function M2Provider(props) {
  const { dbc, children } = props
  const listeners = new EventTarget()

  useEffect(() => {
    function handleMessage(event) {
      try {
        const payload = JSON.parse(event.data)
        listeners.dispatchEvent(new CustomEvent(payload.event, { detail: payload.data }))
      }
      catch {
        throw new Error(`Cannot parse message from M2: ${event.data}`)
      }
    }
    ws.addEventListener('message', handleMessage)
    return () => ws.removeEventListener('message', handleMessage)
  }, [ws])

  function send(event, data) {
    ws.send(JSON.stringify({ event, data }))
  }

  return (
    <M2.Provider value={{ ws, dbc, listeners, send }}>
      {children}
    </M2.Provider>
  )
}

/**
 * Ping pong state hook to prevent idle disconnects, detect unresponsive web sockets,
 * and calculate latency. A message level ping/pong mechanism is required because
 * browsers don't let us implement it at the protocol level.
 * @param {Number} frequency Interval, in milliseconds, at which to ping the server
 * @param {Number} timeout Amount of time, in milliseconds, to allow server to respond
 * to ping with a pong
 */
export function usePingPongState(frequency, timeout) {
  const { ws, send, listeners } = useContext(M2)
  const [ latency, setLatency ] = useState(0)
  const [ connected, setConnected ] = useState(false)

  useEffect(() => {
    let at = 0

    const intervalId = setInterval(() => {
      const now = Date.now()
      if (at !== 0) {
        if (now - at >= timeout) {
          setConnected(false)
          at = 0
          ws.reconnect()
        }
      }
      else {
        at = now
        send('ping')
      }
    }, frequency)

    function handlePong() {
      if (!connected) {
        setConnected(true)
      }
      setLatency(Date.now() - at)
      at = 0
    }
    listeners.addEventListener('pong', handlePong)

    return () => {
      listeners.removeEventListener('pong', handlePong)
      clearInterval(intervalId)
    }
  }, [ws, frequency, timeout])

  return [ connected, latency ]
}

/**
 * Status protocol implementation that tracks the M2's online status and latency
 * between itself and the server.
 */
export function useStatusState() {
  const { ws, listeners } = useContext(M2)
  const [ online, setOnline ] = useState(false)
  const [ latency, setLatency ] = useState(0)
  const [ rate, setRate ] = useState(0)

  useEffect(() => {
    function handleStatus(e) {
      setOnline(e.detail.online)
      setLatency(e.detail.latency)
      setRate(e.detail.rate)
    }
    listeners.addEventListener('status', handleStatus)
    return () => listeners.removeEventListener('status', handleStatus)
  }, [ws])

  return [ online, latency, rate ]
}