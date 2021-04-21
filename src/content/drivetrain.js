// format: [ signal, type, left, top, [decimals] ]
// type can be slab, pill, or hero
export default [
  [ 'DI_elecPower',         'hero', 3, 1 ],
  [ 'DI_sysRegenPowerMax',  'pill', 2, 1 ],
  [ 'DI_sysDrivePowerMax',  'pill', 5, 1 ],
  [ 'DI_inverterT',         'slab', 5, 2 ],
  [ 'DI_statorT',           'slab', 1, 2 ],

  [ 'DI_torqueCommand',     'slab', 1, 4 ],
  [ 'DI_torqueActual',      'pill', 3, 4 ],

  [ 'DI_oilPumpFlowActual', 'slab', 4, 4 ],
  [ 'DI_oilPumpFluidT',     'pill', 6, 4 ],
]