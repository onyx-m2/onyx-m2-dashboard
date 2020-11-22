import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from '../../contexts/SignalContext'
import { ReactComponent as HandbrakeIcon} from '../../assets/handbrake.svg'
import { FadeableComponent } from '../Base'

export default function BrakingIndicator(props) {
  const theme = useContext(ThemeContext)
  const [state, values] = useNamedValuesSignalState('VCLEFT_brakeLightStatus', 'SNA')
  return (
    <FadeableComponent {...props} visible={state === values.ON}>
      <HandbrakeIcon width="100%" height="100%" strokeWidth='30' stroke={theme.indicator.red} />
    </FadeableComponent>
  )
}
