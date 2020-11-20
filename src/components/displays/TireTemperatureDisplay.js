import React from 'react'
import ChassisPaperDoll from './ChassisPaperDoll'

export default function TireTemperatureDisplay(props) {
  return (
    <ChassisPaperDoll {...props} fl='TPMS_temperatureFL' fr='TPMS_temperatureFR' rl='TPMS_temperatureRL' rr='TPMS_temperatureRR' />
  )
}
