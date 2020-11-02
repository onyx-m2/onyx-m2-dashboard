import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Cell, Grid } from 'styled-css-grid'
import { useSignalState } from '../../contexts/SignalContext'
import { ReactComponent as ChassisIcon} from '../../assets/chassis.svg'

export default function ChassisPaperDoll(props) {
  const theme = useContext(ThemeContext)
  const scale = props.scale || 1.0
  const fl = useScaledFormatedSignalState(props.fl, scale)
  const fr = useScaledFormatedSignalState(props.fr, scale)
  const rl = useScaledFormatedSignalState(props.rl, scale)
  const rr = useScaledFormatedSignalState(props.rr, scale)
  return (
    <Grid {...props}
          style={{marginTop: '18px', fontSize: theme.font.size.medium, color: theme.indicator.white}} rows='10px 48px 48px' columns='1fr 70px 1fr' gap='0'>
      <Cell top={2} left={1} style={{justifySelf: 'right'}}>{fl}</Cell>
      <Cell top={1} left={2} height={3}>
        <ChassisIcon width="100%" height="100%" fill={theme.indicator.white} />
      </Cell>
      <Cell top={2} left={3}><span>{fr}</span></Cell>
      <Cell top={3} left={1} style={{justifySelf: 'right'}}>{rl}</Cell>
      <Cell top={3} left={3}>{rr}</Cell>
    </Grid>
  )
}

function useScaledFormatedSignalState(mnemonic, scale) {
  const val = useSignalState(mnemonic, '--')
  if (val !== '--') {
    return Math.round(val * scale)
  }
  return '--'
}