// format: [ signal, type, left, top, [decimals] ]
// type can be slab, pill, or hero
export default [
  [ 'RCM_yawRate', 'slab', 1, 1 ],
  [ 'RCM_yawRateQF', 'pill', 3, 1 ],
  [ 'RCM_pitchRate', 'slab', 1, 2 ],
  [ 'RCM_pitchRateQF', 'pill', 3, 2 ],
  [ 'RCM_rollRate', 'slab', 1, 3 ],
  [ 'RCM_rollRateQF', 'pill', 3, 3 ],

  [ 'RCM_longitudinalAccel', 'slab', 4, 1 ],
  [ 'RCM_longitudinalAccelQF', 'pill', 6, 1 ],
  [ 'RCM_lateralAccel', 'slab', 4, 2 ],
  [ 'RCM_lateralAccelQF', 'pill', 6, 2 ],
  [ 'RCM_verticalAccel', 'slab', 4, 3 ],
  [ 'RCM_verticalAccelQF', 'pill', 6, 3 ],

  [ 'TPMS_temperatureFL', 'pill', 1, 5 ],
  [ 'TPMS_temperatureFR', 'pill', 2, 5 ],
  [ 'TPMS_temperatureRL', 'pill', 1, 6 ],
  [ 'TPMS_temperatureRR', 'pill', 2, 6 ],

  [ 'TPMS_pressureFL', 'pill', 3, 5 ],
  [ 'TPMS_pressureFR', 'pill', 4, 5 ],
  [ 'TPMS_pressureRL', 'pill', 3, 6 ],
  [ 'TPMS_pressureRR', 'pill', 4, 6 ],

  [ 'DI_brakeFLTemp', 'pill', 5, 5 ],
  [ 'DI_brakeFRTemp', 'pill', 6, 5 ],
  [ 'DI_brakeRLTemp', 'pill', 5, 6 ],
  [ 'DI_brakeRRTemp', 'pill', 6, 6 ],

]