import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import GridContext from '../../contexts/GridContext'
import { useNamedValuesSignalState, useSignalState } from '../../contexts/SignalContext'
import { FadeableComponent } from '../Base'
import LinearGauge, { Range, Marker } from './LinearGauge'

export default function BatteryGauge(props) {
  const theme = useContext(ThemeContext)
  const { calcWidth } = useContext(GridContext)

  const carWidth = 1.85 // m
  const [ leftLineUsage, lineUsage ]  = useNamedValuesSignalState('DAS_leftLineUsage', 'REJECTED_UNAVAILABLE')
  const [ rightLineUsage ] = useNamedValuesSignalState('DAS_rightLineUsage', 'REJECTED_UNAVAILABLE')
  const laneWidth = useSignalState('DAS_virtualLaneWidth', 0) // m
  const distanceFromLaneCenter = useSignalState('DAS_virtualLaneC0', 0) // cm

  var enabled = true
  if ((leftLineUsage !== lineUsage.FUSED && rightLineUsage !== lineUsage.FUSED) || laneWidth === 0) {
    enabled = false
  }

  // 0% : exactly in the middle
  // 100% : left or right side of the car is touching the lane markers
  const movementSpaceInLane = (laneWidth - carWidth) / 2
  const deviationPct = -distanceFromLaneCenter / movementSpaceInLane
  return (
    <FadeableComponent {...props} visible={enabled}>
      <LinearGauge from={-100} to={100} length={calcWidth(props.width)}>
        <Range from={-100} to={-33} color={theme.scale.orange} />
        <Range from={-33} to={33} color={theme.scale.white} />
        <Range from={33} to={100} color={theme.scale.orange} />
        <Marker value={deviationPct} color={theme.indicator.white} />
      </LinearGauge>
    </FadeableComponent>
    // <LinearGauge {...props} containerBackgroundColor={theme.background.component} value={deviationPct}>
    //   <Animation enabled={false} />
    //   <Size height={48} />
    //   <RangeContainer width={8}>
    //     <Range startValue={-100} endValue={-33} color={theme.scale.orange} />
    //     <Range startValue={-33} endValue={33} color={theme.scale.white} />
    //     <Range startValue={33} endValue={100} color={theme.scale.orange} />
    //   </RangeContainer>
    //   <Scale startValue={-100} endValue={100} customTicks={[-33, 33]} >
    //     <Tick visible={true} length={10} width={4} color={theme.background.component}></Tick>
    //     <Label visible={false}></Label>
    //   </Scale>
    //   <ValueIndicator type="triangleMarker" verticalOrientation="bottom" offset={-6} length={20} width={30} color={theme.indicator.white} />
    // </LinearGauge>
  )
}
