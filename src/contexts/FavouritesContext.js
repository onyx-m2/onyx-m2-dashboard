import React, { createContext, useState } from 'react'
import { load, save } from '../utils/persistance'

export const FavouritesContext = createContext()

const SCHEMA_VERSION = 1

/**
 * Context provider that gives access to a list of favourite signals.
 * @param {*} props
 */
export function FavouritesProvider(props) {
  const { children } = props

  const [favourites, setFavourites] = useState(load('favourites', SCHEMA_VERSION) || [])
  function toggleFavourite(signal) {
    const index = favourites.findIndex(x => x.signal === signal)
    let updated
    if (index === -1) {
      updated = favourites.concat({ signal, top: 1, left: 1, width: 2, height: 1 })
    } else {
      updated = favourites.filter(x => x.signal !== signal)
    }
    setFavourites(updated)
    save('favourites', updated)
  }

  function isFavourite(signal) {
    return favourites.findIndex(x => x.signal === signal) !== -1
  }

  function moveFavourite(signal, left, top) {
    const index = favourites.findIndex(x => x.signal === signal)
    if (index !== -1) {
      const favourite = favourites[index]
      const updated = favourites.slice(0, index).concat({ signal, left, top, width: favourite.width || 2, height: favourite.height || 1 }, favourites.slice(index + 1))
      setFavourites(updated)
      save('favourites', SCHEMA_VERSION, updated)
    }
  }

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, toggleFavourite, moveFavourite }}>
      {children}
    </FavouritesContext.Provider>
  )
}
