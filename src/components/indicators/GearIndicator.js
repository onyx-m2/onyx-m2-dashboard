import React from 'react'
import styled from 'styled-components'
import { Cell, Grid } from 'styled-css-grid'
import { useNamedValuesSignalState } from '../../contexts/SignalContext'
import { FadeableComponent } from '../Base'

export default function GearIndicator(props) {
  const [gear, values] = useNamedValuesSignalState('DI_gear', 'SNA')
  var visible = true
  if (gear == values.SNA || gear == values.INVALID) {
    visible = false
  }
  return (
    <FadeableComponent {...props} visible={visible}>
      <GearSelectionGrid  rows='1' columns='repeat(4, 1fr)'>
        <GearDisplay selected={gear == values.P}>P</GearDisplay>
        <GearDisplay selected={gear == values.R}>R</GearDisplay>
        <GearDisplay selected={gear == values.N}>N</GearDisplay>
        <GearDisplay selected={gear == values.D}>D</GearDisplay>
      </GearSelectionGrid>
    </FadeableComponent>
  )
}

// We cheat on the gear display and don't respect the grid by mucking with margins,
// you know, for artistic reasons, which means it's okay ;)

const GearSelectionGrid = styled(Grid)`
  font-size: ${props => props.theme.font.size.medium};
  color: ${props => props.theme.indicator.grey};
  margin-top: 18px;
  margin-left: -8px;
  margin-right: -8px;
`

const GearDisplay = styled(Cell)`
  display: inline-flex;
  flex-flow: column;
  justify-self: center;
  justify-content: flex-end;
  color: ${props => props.selected && props.theme.indicator.white};
  font-weight: ${props => props.selected ? 'bold' : ''};
`
