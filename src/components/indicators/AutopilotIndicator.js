import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from '../../contexts/SignalContext'
import { ReactComponent as SteeringWheelIcon} from '../../assets/steering-wheel.svg'
import { FadeableComponent } from '../Base'

export default function AutopilotIndicator(props) {
  const theme = useContext(ThemeContext)
  const [state, states] = useNamedValuesSignalState('DAS_autopilotState', 'SNA')
  const [handsOnState, handsOnStates] = useNamedValuesSignalState('DAS_autopilotHandsOnState', 'SNA')

  // if ap is not active, or there's no signal from the hands on detection, don't
  // light up the indicator
  var visible = true
  if (state == states.SNA || state == states.DISABLED || state == states.UNAVAILABLE) {
    visible = false
  }

  var color = theme.indicator.grey
  if (state == states.ACTIVE_NOMINAL) {
    switch (handsOnState) {
      case handsOnStates.SNA:
      case handsOnStates.REQD_DETECTED:
      case handsOnStates.NOT_REQD:
        color = theme.indicator.blue
        break

      case handsOnStates.REQD_NOT_DETECTED:
        color = theme.indicator.yellow
        break

      case handsOnStates.REQD_VISUAL:
        color = theme.indicator.orange
        break

      case handsOnStates.REQD_CHIME_1:
      case handsOnStates.REQD_CHIME_2:
      case handsOnStates.REQD_SLOWING:
      case handsOnStates.REQD_STRUCK_OUT:
      case handsOnStates.SUSPENDED:
        color = theme.indicator.red
        break
    }
  }
  return (
    <FadeableComponent {...props} visible={visible}>
      <SteeringWheelIcon width="100%" height="100%" fill={color} />
    </FadeableComponent>
  )
}
