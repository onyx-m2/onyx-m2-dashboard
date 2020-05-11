import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import './Signal.css'
import M2 from '../services/m2'
import { useSignalState } from '../services/signal-manager'

/**
 * Component displaying a realtime canbus signal.
 * @component
 */
export default function Signal(props) {
  const decimals = props.decimals || 2
  const { dbc } = useContext(M2)

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

Signal.propTypes = {
  /**
   * Number of decimal places to display
   */
  decimals: PropTypes.number,

  /**
   * Mnemonic of the signal to display
   */
  mnemonic: PropTypes.string.isRequired
}