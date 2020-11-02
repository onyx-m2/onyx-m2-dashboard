import React from 'react'
import ChassisPaperDoll from './ChassisPaperDoll'

export default function TirePressureDisplay(props) {
  return (
    <ChassisPaperDoll {...props} fl='TPMS_pressureFL' fr='TPMS_pressureFR' rl='TPMS_pressureRL' rr='TPMS_pressureRR' scale={14.5038} />
  )
}
