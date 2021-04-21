import React, { useState } from 'react'
import { load, save } from '../utils/persistance'
import { SignalPill, SignalSlab, SignalHero } from './Signal'
import TileGrid from './TileGrid'

const sizes = {
  pill: {width: 1, height: 1},
  slab: {width: 2, height: 1},
  bigslab: {width: 4, height: 1},
  hero: {width: 2, height: 2}
}

/**
 * Component that displays a custom signal grid layout. The layouts are defined in
 * the `contents` directory. This component will save positions as the tiles are
 * modified, but any change to the original grid definition will override the
 * user-defined changes. This works by comparing the tile's hash value to the stored
 * one.
 *
 * @component
 */
export default function SignalsGrid(props) {
  const [ tiles, setTiles ] = useState(load(props.slug, props.hash) || props.tiles)

  function moveTile(signal, left, top) {
    const updatedTiles = tiles.map(t => {
      if (t.signal === signal) {
        return { ...t, left, top }
      }
      return t
    })
    setTiles(updatedTiles)
    save(props.slug, props.hash, updatedTiles)
  }

  return (
    <TileGrid onTileMoved={(signal, left, top) => moveTile(signal, left, top)}>
      {tiles.map(({ signal, type, left, top, decimals }) => (
        <TileGrid.Tile uppercase key={signal}
          left={left}
          top={top}
          width={sizes[type].width}
          height={sizes[type].height}>
          {(() => {
            switch (type) {
              case 'pill':
                return <SignalPill decimals={decimals} mnemonic={signal} />
              case 'slab':
              case 'bigslab':
                return <SignalSlab mnemonic={signal} />
              case 'hero':
                return <SignalHero decimals={decimals}  mnemonic={signal} />
              // no default
            }
          })()}
        </TileGrid.Tile>
      ))}
    </TileGrid>
  )
}