import React, { createContext, useState } from 'react'
import { load, save } from '../utils/persistance'

export const FavouritesContext = createContext()

/**
 * Context provider that gives access to a list of favourite signals.
 * @param {*} props
 */
export function FavouritesProvider(props) {
  const { children } = props

  const [favourites, setFavourites] = useState(load('favourites') || [])
  function toggleFavourite(mnemonic) {
    const index = favourites.findIndex(x => x === mnemonic)
    let updated
    if (index === -1) {
      updated = favourites.concat(mnemonic)
    } else {
      updated = favourites.filter(x => x !== mnemonic)
    }
    setFavourites(updated)
    save('favourites', updated)
  }

  function isFavourite(mnemonic) {
    return favourites.findIndex(x => x === mnemonic) !== -1
  }

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  )
}
