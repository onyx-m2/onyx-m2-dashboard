import React, { createContext, useState } from 'react'
import { load, save } from '../utils/persistance'

const SCHEMA_VERSION = 1

const Favourites = createContext()
export default Favourites


/**
 * Context provider that gives access to a list of favourite signals.
 * @param {*} props
 */
export function FavouritesProvider(props) {
  const { children } = props
  const [ favourites, setFavourites ] = useState(load('favourites', SCHEMA_VERSION) || [])

  function isFavourite(signal) {
    return favourites.findIndex(f => f.signal === signal) !== -1
  }

  function toggleFavourite(signal) {
    let updated
    const index = favourites.findIndex(f => f.signal === signal)
    if (index === -1) {
      updated = favourites.concat({ signal, left: 1, top: 1 })
    }
    else {
      updated = favourites.filter(f => f.signal !== signal)
    }
    setFavourites(updated)
    save('favourites', SCHEMA_VERSION, updated)
  }

  function moveFavourite(signal, left, top) {
    const updated = favourites.map(f => {
      if (f.signal === signal) {
        return { ...f, left, top }
      }
      return f
    })
    setFavourites(updated)
    save('favourites', SCHEMA_VERSION, updated)
  }

  return (
    <Favourites.Provider value={{ favourites, isFavourite, toggleFavourite, moveFavourite }}>
      {children}
    </Favourites.Provider>
  )
}
