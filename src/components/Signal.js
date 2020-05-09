import React, { useContext, useEffect, useState } from 'react'
import './Signal.css'
import {  } from '../services/m2'
import M2 from '../services/m2'
import { useSignalState } from '../services/signal-manager'
//import M2 from '../services/m2-old'
//import DBC from '../services/dbc'

// Signal Component, a realtime canbus signal display
// Props:
//   - mnemonic: the mnemonic of the signal to display
export default function Signal(props) {
  const decimals = props.decimals || 2
  const { dbc } = useContext(M2)
  //const signal = DBC.getSignal(props.mnemonic)
  // const signal = useDbcContext()

  // let initialValue =  signal.value
  // if (initialValue === null || initialValue === undefined) {
  //   initialValue = '--'
  // }
  // const value = useSignalEffect(signal, initialValue)

  const value = useSignalState(props.mnemonic, '--')
  let displayValue = value
  if (typeof(value) === 'number') {
    const factor = Math.pow(10, decimals)
    displayValue = Math.round(value * factor) / factor
  }

  const definition = dbc.getSignal(props.mnemonic)
  let displayUnits = definition.units
  if (definition.values) {
    const definedValue = definition.values[definition.value]
    if (definedValue) {
      displayUnits = definedValue.replace(/_/g, ' ')
    }
  }

  return (
    <div className='Signal'>
      <div>{definition.name}</div>
      <div className='data'>
        <div className='value'>{displayValue}</div>
        <div className='units'>{displayUnits}</div>
      </div>
    </div>
  )
}

// function useSignalEffect(signal, initialValue) {
//   const [ value, setValue ] = useState(initialValue)
//   useEffect(() => {
//     const handleChange = (newValue) => setValue(newValue)
//     M2.addSignalListener(signal, handleChange)
//     return () => M2.removeSignalListener(signal, handleChange)
//   }, [signal])
//   return value
// }