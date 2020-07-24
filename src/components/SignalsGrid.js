import React, { useContext, useState, useRef, useEffect, useMemo, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { SignalSlab, SignalHero } from './Signal'
import TileGrid from './TileGrid'
import CMS from '../contexts/CMS'


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
    <TileGrid onTileMoved={(id, left, top) => moveGridTile(grid, id, left, top)} columns={5}>
      {signalTiles().map((t, i) => (
        <TileGrid.Tile key={t.id} left={t.tile.left} top={t.tile.top} width={t.tile.width} height={t.tile.height}>
          <SignalSlab caption={t.tile.caption} mnemonic={t.signal.mnemonic} showName={t.showSignalName} showUnits={t.showSignalUnits} />
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
