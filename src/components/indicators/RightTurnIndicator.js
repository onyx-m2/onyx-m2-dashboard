import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from '../../contexts/SignalContext'
import { ReactComponent as RightArrowIcon} from '../../assets/right-arrow.svg'
import { FadeableComponent } from '../Base'

export default function RightTurnIndicator(props) {
  const theme = useContext(ThemeContext)
  const [state, states] = useNamedValuesSignalState('VCRIGHT_turnSignalStatus', 'SNA')
  return (
    <FadeableComponent {...props} visible={state == states.ON}>
      <RightArrowIcon width="100%" height="100%" fill={theme.indicator.green} />
    </FadeableComponent>
  )
}