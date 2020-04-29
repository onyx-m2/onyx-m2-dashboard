import React, { useEffect, useState } from 'react'
import './Signal.css'
import M2 from '../services/m2'
import DBC from '../services/dbc'

// Signal Component, a realtime canbus signal display
// Props:
//   - mnemonic: the mnemonic of the signal to display
export default function Signal(props) {
  const signal = DBC.getSignal(props.mnemonic)

  let initialValue =  signal.value
  if (initialValue === null || initialValue === undefined) {
    initialValue = '--'
  }
  const value = useSignalEffect(signal, initialValue)

  let units = signal.units
  if (signal.values) {
    const definedValue = signal.values[signal.value]
    if (definedValue) {
      units = definedValue.replace(/_/g, ' ')
    }
  }

  return (
    <div className='Signal'>
      <div>{signal.name}</div>
      <div className='data'>
        <div className='value'>{value}</div>
        <div className='units'>{units}</div>
      </div>
    </div>
  )
}

function useSignalEffect(signal, initialValue) {
  const [ value, setValue ] = useState(initialValue)
  useEffect(() => {
    const handleChange = (newValue) => setValue(newValue)
    M2.addSignalListener(signal, handleChange)
    return () => M2.removeSignalListener(signal, handleChange)
  }, [false])
  return value
}