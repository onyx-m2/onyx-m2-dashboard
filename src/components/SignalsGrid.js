import React, { useContext } from 'react'
import { SignalPill, SignalSlab, SignalHero } from './Signal'
import TileGrid from './TileGrid'
import CMS from '../contexts/CMS'

const sizes = {
  pill: {width: 1, height: 1},
  slab: {width: 2, height: 1},
  hero: {width: 2, height: 2}
}

/**
 * Component that displays ...
 * @component
 */
export default function SignalsGrid(props) {
  const { grid } = props
  const { moveGridTile } = useContext(CMS)

  function signalTiles() {
    return grid.tiles.filter(t => t.__component === 'tile-components.signal-tile')
  }

  return (
    <TileGrid onTileMoved={(id, left, top) => moveGridTile(grid, id, left, top)} rows={grid.rows} columns={grid.columns}>
      {signalTiles().map((t, i) => (
        <TileGrid.Tile
          key={t.id}
          left={t.tile.left}
          top={t.tile.top}
          width={sizes[t.tile.displayType].width}
          height={sizes[t.tile.displayType].height}>
          {(() => {
            switch (t.tile.displayType) {
              case 'pill':
                return <SignalPill mnemonic={t.signal.mnemonic} />
              case 'slab':
                return <SignalSlab caption={t.tile.caption} mnemonic={t.signal.mnemonic} showName={t.showSignalName} showUnits={t.showSignalUnits} />
              case 'hero':
                return <SignalHero decimals={0} mnemonic={t.signal.mnemonic} />
              // no default
            }
          })()}
        </TileGrid.Tile>
      ))}
    </TileGrid>
  )
}

// const SignalTile = forwardRef((props, ref) => {
//   const { caption, signal, selected } = props
//   return (
//     <Tile ref={ref} {...props} selected={selected} >
//       <Signal mnemonic={signal.mnemonic} caption={caption || signal.name} />
//     </Tile>
//   )
// })

// const ComputedSignalTile = forwardRef((props, ref) => {
//   const { caption, id, selected } = props
//   const [ signal, setSignal ] = useState()
//   useEffect(() => {
//     const fetch = async () => {
//       const { data } = await cms.get(`/signals/${id}`)
//       setSignal(data)
//     }
//     fetch()
//   }, [id])
//   if (signal) {
//     return (
//       <Tile ref={ref} {...props} selected={selected} >
//         <Signal mnemonic={signal.definition[0].value} caption={caption || signal.name} />
//       </Tile>
//     )
//   }
// })
