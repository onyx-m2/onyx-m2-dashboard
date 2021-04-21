import React, { useContext } from 'react'
import { SignalSlab } from './Signal'
import TileGrid from './TileGrid'
import { M2 } from 'onyx-m2-react'
import { useHistory } from 'react-router-dom'
import Favourites from '../contexts/Favourites'

/**
 * Component that displays the current favourite signals.
 * @component
 */
export default function FavouritesGrid() {
  const history = useHistory()
  const { favourites, moveFavourite } = useContext(Favourites)
  const { dbc } = useContext(M2)


  function onTileTapped(e, f) {
    const msg = dbc.getSignalMessage(f.signal)
    if (msg) {
      history.push(`/signals/${msg.category}/${msg.slug}`)
    }
  }

  return (
    <TileGrid onTileMoved={moveFavourite}>
      {favourites.map(f => (
        <TileGrid.Tile uppercase key={f.signal} left={f.left} top={f.top} onClick={(e) => onTileTapped(e, f)}>
          <SignalSlab mnemonic={f.signal} />
        </TileGrid.Tile>
      ))}
    </TileGrid>
  )
}
