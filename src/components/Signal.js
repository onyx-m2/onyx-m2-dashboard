import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import M2 from '../contexts/M2'
import { useSignalState } from '../contexts/SignalContext'
import { Icon } from 'semantic-ui-react'
import { Grid } from 'styled-css-grid'
import styled from 'styled-components'

/**
 * Component displaying a realtime canbus signal.
 * @component
 */
export default function Signal(props) {
  const { onClick, icon } = props
  const decimals = props.decimals || 2
  const { dbc } = useContext(M2)

  const value = useSignalState(props.mnemonic, '--')
  let displayValue = value
  if (typeof(value) === 'number') {
    const factor = Math.pow(10, decimals)
    displayValue = Math.round(value * factor) / factor
  }

  const definition = dbc.getSignal(props.mnemonic)
  let displayUnits = 'N/A'
  let displayName = props.mnemonic
  if (definition) {
    displayName = definition.name
    displayUnits = definition.units
    if (definition.values) {
      const definedValue = definition.values[value]
      if (definedValue) {
        displayUnits = definedValue.replace(/_/g, ' ')
      }
    }
  }

  return (
    <SignalGrid gap='10px' rows={1} columns={'2fr 1fr'} onClick={onClick}>
      <div>{icon && <Icon name={icon} />}{displayName}</div>
      <Data>
        <Value>{displayValue}</Value>
        <Units>{displayUnits}</Units>
      </Data>
    </SignalGrid>
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

const SignalGrid = styled(Grid)`
  margin: 20px;
`

const Data = styled.div`
  text-align: right;
  margin-top: 6px;

`

const Value = styled.div`
  font-size: 2em;
`

const Units = styled.div`
  color: #767676;
  font-size: 0.8em;
`