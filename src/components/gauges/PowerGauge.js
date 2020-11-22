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
export default function PowerGauge(props) {
  const { from, to, invert, length, children } = props
  const theme = useContext(ThemeContext)

  const power = useSignalState('DI_elecPower', -10)
  const drivePower = useSignalState('DI_sysDrivePowerMax', 240)
  const regenPower = useSignalState('DI_sysRegenPowerMax', 60)

  var powerColour = theme.indicator.white
  if (power < 0) {
    powerColour = theme.indicator.green
  }

  return (
    <FadeableComponent className='PowerGauge' {...props}>
      <CircularGauge value={power} containerBackgroundColor={theme.background.component}>
        <Animation enabled={false} />
        <Scale startValue={-regenPower} endValue={drivePower} tickInterval={30}>
          <Label visible={LABELS} useRangeColors={true} indentFromTick={DIAL_LABEL_OFFSET}>
            <Font size={20} />
          </Label>
          <Tick visible={false} color={theme.background.component} length={10} width={4} />
        </Scale>
        <RangeContainer width={OUTER_DIAL_WIDTH}>
          <Range startValue={-regenPower} endValue={-1} color={theme.scale.green} />
          <Range startValue={0} endValue={drivePower} color={theme.scale.white} />
        </RangeContainer>
        <Geometry startAngle={225} endAngle={315} />
        <ValueIndicator
          type="twoColorNeedle"
          secondFraction={0.31}
          color="none"
          secondColor={powerColour}
          width={LINE_WIDTH}
          offset={10}
        />
      </CircularGauge>
      <CircularGaugeUnits>kW</CircularGaugeUnits>
      <CircularGaugeValue colour={powerColour}>{Math.abs(Math.round(power))}</CircularGaugeValue>
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
