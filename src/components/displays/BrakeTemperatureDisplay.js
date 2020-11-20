import React from 'react'
import ChassisPaperDoll from './ChassisPaperDoll'

export default function BrakeTemperatureDisplay(props) {
  return (
    <ChassisPaperDoll {...props} fl='DI_brakeFLTemp' fr='DI_brakeFRTemp' rl='DI_brakeRLTemp' rr='DI_brakeRRTemp' />
  )
}
