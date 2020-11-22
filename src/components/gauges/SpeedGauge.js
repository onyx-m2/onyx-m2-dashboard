import CircularGauge, { Font, Geometry, Range, RangeContainer, Scale, Label, Tick, ValueIndicator, Animation } from 'devextreme-react/circular-gauge';
import React, { Children, cloneElement, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useSignalState } from '../../contexts/SignalContext';
import { FadeableComponent } from '../Base';


const OUTER_DIAL_WIDTH = 10
const DIAL_LABEL_OFFSET = -10
const LINE_WIDTH = 3
const LABELS = true

// SVG doesn't seem to want to play nice with dynamic sizing (which is ironic for a
// scalable vector format), so we'll have to pass in the length of the gauge.

// from, to
// ranges: [{ from, to, color}]
// markers: [{ value, color }]
export default function SpeedGauge(props) {
  //const { from, to, invert, length, children } = props
  const theme = useContext(ThemeContext)

  const speed = useSignalState('DI_uiSpeed', 140)
  var speedColour = theme.indicator.white
  if (speed > 160) {
    speedColour = theme.indicator.red
  } else if (speed > 120) {
    speedColour = theme.indicator.orange
  } else if (speed > 100) {
    speedColour = theme.indicator.yellow
  }

  return (
    <FadeableComponent className='SpeedGauge' {...props}>
      <CircularGauge value={speed} containerBackgroundColor={theme.background.component} >
        <Animation enabled={true} />
        <Scale startValue={0} endValue={200} tickInterval={20}>
          {/* <Label visible={false} /> */}
          <Label visible={LABELS} useRangeColors={true} indentFromTick={DIAL_LABEL_OFFSET}>
            <Font size={20} />
          </Label>
          <Tick visible={false} length={8} width={6} color={theme.background.component} />
        </Scale>
        <RangeContainer width={OUTER_DIAL_WIDTH}>
          <Range startValue={0} endValue={99} color={theme.scale.white} />
          <Range startValue={100} endValue={119} color={theme.scale.yellow} />
          <Range startValue={120} endValue={159} color={theme.scale.orange} />
          <Range startValue={160} endValue={200} color={theme.scale.red} />
        </RangeContainer>
        <Geometry startAngle={225} endAngle={315} />
        <ValueIndicator
          type="twoColorNeedle"
          secondFraction={0.31}
          color="none"
          secondColor={speedColour}
          width={LINE_WIDTH}
          offset={10}
        />
      </CircularGauge>
      <CircularGaugeUnits>km/h</CircularGaugeUnits>
      <CircularGaugeValue colour={speedColour}>{Math.round(speed)}</CircularGaugeValue>
      {/* <CircularGaugeSubUnits>km</CircularGaugeSubUnits>
      <CircularGaugeSubValue>{Math.round(odometer).toLocaleString()}</CircularGaugeSubValue> */}
    </FadeableComponent>
  )
}

export function Ranges(props) {
  return (
    <g>
      {props.children}
    </g>
  )
}


const GaugeDisplay = styled.div`
  position: relative;
`

const CircularGaugeValue = styled.div`
  color: ${props => props.colour};
  //color: white;
  position: absolute;
  text-align: center;
  //font-size: 64px;
  font-family: 'Gotham Extra Light';
  font-size: 84px;
  top: 0;
  width: ${props => props.theme.circular.size};

    border-radius: 200px;
    border: solid;
    border-width: ${LINE_WIDTH}px;
    width: 200px;
    height: 200px;
    top: 75px;
    left: 65px;
    //line-height: 200px;
  //line-height: 300px;
  line-height: 150px;
`
const CircularGaugeUnits = styled.div`
    color: ${props => props.theme.scale.white};
    position: absolute;
    //top: 100px;
    bottom: 20px;
    text-align: center;
    font-size: 14px;
    width: ${props => props.theme.circular.size};
`

const CircularGaugeSubValue = styled.div`
    color: ${props => props.theme.indicator.white};
    position: absolute;
    text-align: center;
    font-family: 'Gotham Light';
    font-size: 24px;
    bottom: -20px;
    width: ${props => props.theme.circular.size};
`

const CircularGaugeSubUnits = styled.div`
    color: ${props => props.theme.scale.white};
    position: absolute;
    bottom: 10px;
    text-align: center;
    font-size: 14px;
    width: ${props => props.theme.circular.size};
`
