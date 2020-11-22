import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from '../../contexts/SignalContext'
import { ReactComponent as LeftArrowIcon} from '../../assets/left-arrow.svg'
import { FadeableComponent } from '../Base'

export default function LeftTurnIndicator(props) {
  const theme = useContext(ThemeContext)
  const [state, states] = useNamedValuesSignalState('VCLEFT_turnSignalStatus', 'SNA')
  return (
    <FadeableComponent {...props} visible={state === states.ON}>
      <LeftArrowIcon width="100%" height="100%" strokeWidth='30' stroke={theme.indicator.green} />
    </FadeableComponent>
  )
}
