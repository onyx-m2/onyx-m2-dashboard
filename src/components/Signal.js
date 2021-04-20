import React from 'react'
import { useSignalDisplay } from 'onyx-m2-react'
import { Icon } from 'semantic-ui-react'
import { Grid } from 'styled-css-grid'
import styled from 'styled-components'

/**
 * Component displaying a realtime canbus signal.
 * @component
 */
export function SignalSlab(props) {
  const { icon, decimals, mnemonic, caption } = props
  const { name, value, units } = useSignalDisplay(mnemonic, decimals)
  return (
    <SignalGrid gap='10px' rows={1} columns={'2fr 1fr'} {...props}>
      <div>{icon && <Icon name={icon} />}{caption || name}</div>
      <Data>
        <Value>{value}</Value>
        <Units>{units}</Units>
      </Data>
    </SignalGrid>
  )
}

/**
 * Component displaying a realtime canbus signal.
 * @component
 */
export function SignalPill(props) {
  const { decimals, mnemonic } = props
  const { value, units } = useSignalDisplay(mnemonic, decimals)
  return (
    <CenteredGrid alignItems='center' rows={'2fr 1fr'} columns={1} {...props}>
      <Value>{value}</Value>
      <Units>{units}</Units>
    </CenteredGrid>
  )
}

export function SignalHero(props) {
  const { decimals, mnemonic } = props
  const { value, units } = useSignalDisplay(mnemonic, decimals)
  return (
    <CenteredGrid alignItems='center' rows={'5fr 1fr'} columns={1} {...props}>
      <BigValue>{value}</BigValue>
      <Units>{units}</Units>
    </CenteredGrid>
  )
}

const CenteredGrid = styled(Grid)`
  align-items: center;
  justify-items: center;
`

// const BigData = styled.div`
//   text-align: center;
//   margin-top: 6px;
// `

const BigValue = styled.div`
  font-size: 5em;
`

// export default function Signal(props) {
//   const { icon, mnemonic, caption, showName, showUnits, } = props
//   const decimals = props.decimals || 2
//   const { dbc } = useContext(M2)

//   const value = useSignalState(mnemonic, '--')
//   let displayValue = value
//   if (typeof(value) === 'number') {
//     const factor = Math.pow(10, decimals)
//     displayValue = Math.round(value * factor) / factor
//   }

//   const definition = dbc.getSignal(mnemonic)
//   let displayUnits = 'N/A'
//   let displayName = caption || mnemonic
//   if (definition) {
//     displayName = caption || definition.name
//     displayUnits = definition.units
//     if (definition.values) {
//       const definedValue = definition.values[value]
//       if (definedValue) {
//         displayUnits = definedValue.replace(/_/g, ' ')
//       }
//     }
//   }

//   return (
//     <SignalGrid gap='10px' rows={1} columns={'2fr 1fr'} {...props} >
//       <div>{icon && <Icon name={icon} />}{(caption || showName) && displayName}</div>
//       <Data>
//         <Value>{displayValue}</Value>
//         {showUnits && <Units>{displayUnits}</Units>}
//       </Data>
//     </SignalGrid>
//   )
// }

// Signal.defaultProps = {
//   showName: true,
//   showUnits: true
// }

// Signal.propTypes = {
//   /**
//    * Number of decimal places to display
//    */
//   decimals: PropTypes.number,

//   /**
//    * Mnemonic of the signal to display
//    */
//   mnemonic: PropTypes.string.isRequired
// }

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