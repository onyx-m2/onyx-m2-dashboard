import React, { useContext } from 'react'
//import LinearGauge, { Animation, RangeContainer, Size, Scale, Tick, Label, Range, ValueIndicator } from 'devextreme-react/linear-gauge'
import LinearGauge, { Range, Marker } from './LinearGauge'
import styled, { ThemeContext } from 'styled-components'
import { useSignalState } from '../../contexts/SignalContext'
import GridContext from '../../contexts/GridContext'
import { FadeableComponent } from '../Base'

// FIXME: alignment in this component is super hacky - probably won't work if moved around or resized

export default function BatteryGauge(props) {
  const theme = useContext(ThemeContext)
  const { calcWidth } = useContext(GridContext)

  const soc = Math.floor(useSignalState('UI_soc', -1))
  const nominalFullPackEnergy = useSignalState('BMS_nominalFullPackEnergy', 50)
  const tripPlanningActive = useSignalState('UI_tripPlanningActive', 0)
  const energyAtDestination = useSignalState('UI_energyAtDestination', 0)
  const socAtDestination = tripPlanningActive ? Math.round(energyAtDestination * 100 / nominalFullPackEnergy) : soc

  const socColor = batteryColor(soc)
  const socAtDestinationColor = batteryColor(socAtDestination)

  function batteryColor(soc) {
    if (soc > 20) {
      return theme.indicator.green
    }
    if (soc > 10) {
      return theme.indicator.yellow
    }
    return theme.indicator.red
  }

  return (
    <FadeableComponent {...props} visible={soc != -1}>
      <StateOfChargeDisplay color={socColor}>
        <StateOfCharge>{soc}</StateOfCharge><span>%</span>
      </StateOfChargeDisplay>
      <LinearGauge from={0} to={100} invert length={calcWidth(props.width)}>
        <Range from={0} to={soc} color={socColor} />
        <Range from={soc} to={100} color={theme.scale.white} />
        <Marker value={socAtDestination} color={socAtDestinationColor} />
      </LinearGauge>
      {/* <LinearGauge containerBackgroundColor={theme.background.component} value={socAtDestination}>
        <Animation enabled={false} />
        <Size height={48} />
        <Scale startValue={100} endValue={0} customTicks={[soc]} >
          <Tick visible={true} length={8} width={4} color={theme.background.component} />
          <Label visible={false} />
        </Scale>
        <RangeContainer width={8}>
          <Range startValue={100} endValue={soc} color={theme.scale.white} />
          <Range startValue={soc} endValue={0} color={socColor} />
        </RangeContainer>
        <ValueIndicator type="triangleMarker" verticalOrientation="bottom" offset={-6} length={20} width={30} color={socAtDestinationColor} />
      </LinearGauge> */}
    </FadeableComponent>
  )
}

const StateOfChargeDisplay = styled.div`
  color: ${props => props.color};
  text-align: right;
  margin-top: 46px;
  margin-right: 8px;
  /* margin-bottom: -10px; */
`

const StateOfCharge = styled.span`
  font-size: ${props => props.theme.font.size.large};
`
