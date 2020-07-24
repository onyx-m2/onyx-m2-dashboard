import React, { useContext, useState, useRef, useEffect, useMemo, forwardRef } from 'react'
import { SignalSlab } from './Signal'
import TileGrid from './TileGrid'
import M2 from '../contexts/M2'
import { useHistory } from 'react-router-dom'
import { load, save } from '../utils/persistance'
import CMS from '../contexts/CMS'

const SCHEMA_VERSION = 1

/**
 * Component that displays ...
 * @component
 */
export default function FavouritesGrid() {
  const history = useHistory();
  const { favourites } = useContext(CMS)
  const { dbc } = useContext(M2)

  const [ positions, setPositions ] = useState(load('favourites-positions', SCHEMA_VERSION) || {})
  const [ tiles, setTiles ] = useState([])
  useEffect(() => {
    setTiles(favourites.map((f, i) => ({
      left: positions[f.id]?.left || 1,
      top: positions[f.id]?.top || 1,
      ...f
    })))
  }, [favourites])

  function tileMoved(key, left, top) {
    const updatedTiles = tiles.map(t => {
      if (t.id == key) {
        return { ...t, left, top }
      }
      return t
    })
    setTiles(updatedTiles)

    let updatedPositions = {}
    updatedTiles.forEach(t => {
      updatedPositions[t.id] = {
        left: t.left,
        top: t.top
      }
    })
    setPositions(updatedPositions)
    save('favourites-positions', SCHEMA_VERSION, updatedPositions)
  }

  function tileTapped(key) {
    const tile = tiles.find(t => t.id == key)
    if (tile) {
      const msg = dbc.getSignalMessage(tile.mnemonic)
      if (msg) {
        setTimeout(() => history.push(`/signals/${msg.category}/${msg.slug}`))
      }
    }
  }

  return (
    <TileGrid onTileMoved={tileMoved} onTileTapped={tileTapped}>
      {tiles.map((f, i) => (
        <TileGrid.Tile uppercase key={f.id} left={f.left} top={f.top} >
          <SignalSlab caption={f.name} mnemonic={f.mnemonic} />
        </TileGrid.Tile>
      ))}
    </TileGrid>
  )
}
