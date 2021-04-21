import battery from './battery'
import drivetrain from './drivetrain'
import autopilot from './autopilot'
import track from './track'

// The list of grids to display in the main menu (edit this to change menu)
// Format: [name, slug, icon, columns, rows, tiles]
const grids = [
  [ 'Battery',    'battery',    'battery high', 6, 8, battery ],
  [ 'Drivetrain', 'drivetrain', 'car',          8, 8, drivetrain ],
  [ 'Autopilot',  'autopilot',  'paper plane',  6, 8, autopilot ],
  [ 'Track',      'track',      'road',         8, 8, track ]
]

// Grids are exported as object so it's easiest to read the code that's processing
// the data. Array syntax is used for input because it's more compact and easier to
// read.
export default grids.map(([ name, slug, icon, columns, rows, tiles ]) => ({
  name, slug, icon, columns, rows,
  tiles: tiles.map(([ signal, type, left, top ]) => ({ signal, type, left, top })),
  hash: hashCode(tiles.reduce((acc, cur) => acc + cur))
}))

// lifted from https://stackoverflow.com/a/7616484/3613005, credit to @esmiralha
function hashCode(text) {
  var hash = 0, i, chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr   = text.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};