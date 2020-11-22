import React, { useContext } from 'react'
import LinearGauge, { Range, Marker } from './LinearGauge'
import styled, { ThemeContext } from 'styled-components'
import { useSignalState } from '../../contexts/SignalContext'
import GridContext from '../../contexts/GridContext'
import { FadeableComponent } from '../Base'
//import { ReactComponent as SnowflakeIcon } from '../../assets/snowflake.svg'
import { Cell, Grid } from 'styled-css-grid'

// FIXME: alignment in this component is super hacky - probably won't work if moved around or resized

export default function BatteryGauge(props) {
  const theme = useContext(ThemeContext)
  const { calcWidth } = useContext(GridContext)

  const usableSOC = useSignalState('UI_usableSOC', -1)
  //const actualSOC = useSignalState('UI_actualSOC', -1)
  //const coldMode = usableSOC !== actualSOC

  const nominalFullPackEnergy = useSignalState('BMS_nominalFullPackEnergy', 50)
  const tripPlanningActive = useSignalState('UI_tripPlanningActive', 0)
  const energyAtDestination = useSignalState('UI_energyAtDestination', 0)
  const socAtDestination = tripPlanningActive ? Math.round(energyAtDestination * 100 / nominalFullPackEnergy) : usableSOC

  const usableSOCColor = batteryColor(usableSOC)
  const socAtDestinationColor = batteryColor(socAtDestination, true)

  function batteryColor(soc, useColdMode) {
    if (soc > 20) {
      return theme.indicator.green
    }
    if (soc > 10) {
      return theme.indicator.yellow
    }
    return theme.indicator.red
  }

  return (
    <FadeableComponent {...props} visible={usableSOC !== -1}>
      <Grid rows='2' columns='2' gap='0'>
        <Cell top='1' left='1'>
          {/* <ColdModeSOCDisplay>
            <SnowflakeIcon width={18} fill={theme.indicator.blue} />
            <span> {actualSOC}%</span>
          </ColdModeSOCDisplay> */}
        </Cell>
        <Cell top='1' left='2'>
          <StateOfChargeDisplay color={usableSOCColor}>
            <StateOfCharge>{usableSOC}</StateOfCharge><span>%</span>
          </StateOfChargeDisplay>
        </Cell>
        <Cell top='2' left='1' width='2'>
          <LinearGauge from={0} to={100} invert length={calcWidth(props.width)}>
            <Range from={0} to={usableSOC} color={usableSOCColor} />
            <Range from={usableSOC} to={100} color={theme.scale.white} />
            <Marker value={socAtDestination} color={socAtDestinationColor} />
          </LinearGauge>
        </Cell>
      </Grid>
    </FadeableComponent>
  )
}

const StateOfChargeDisplay = styled.div`
  color: ${props => props.color};
  text-align: right;
  margin-top: 46px;
  margin-right: 8px;
`

const StateOfCharge = styled.span`
  font-size: ${props => props.theme.font.size.large};
  font-family: 'Gotham Light';
`

// const ColdModeSOCDisplay = styled.div`
//   font-size: ${props => props.theme.font.size.medium};
//   color: ${props => props.theme.indicator.blue};
// `