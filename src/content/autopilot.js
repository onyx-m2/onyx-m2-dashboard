// format: [ signal, type, left, top, [decimals] ]
// type can be slab, pill, or hero
const grid = [
  ['DAS_virtualLaneC0', 'hero', 1, 2],
  ['DAS_virtualLaneC1', 'hero', 3, 2],
  ['DAS_autopilotState', 'slab', 1, 1],
  ['DAS_activationFailureStatus', 'slab', 3, 1],
  ['DAS_autopilotHandsOnState', 'bigslab', 1, 4],
  ['SCCM_steeringAngle', 'slab', 5, 4],
  ['SCCM_steeringAngleSpeed', 'pill', 5, 5],
  ['SCCM_steeringAngleValidity', 'pill', 6, 5],
  ['VCLEFT_brakeLightStatus', 'slab', 5, 1],
  ['ESP_brakeTorqueFL', 'pill', 5, 2],
  ['ESP_brakeTorqueFR', 'pill', 6, 2],
  ['ESP_brakeTorqueRL', 'pill', 5, 3],
  ['ESP_brakeTorqueRR', 'pill', 6, 3],
]
export default grid
