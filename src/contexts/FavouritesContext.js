import React, { createContext, useState, useEffect } from 'react'
import { load, save } from '../utils/persistance'
import { cms } from '../utils/services'

export const FavouritesContext = createContext()

const SCHEMA_VERSION = 1

/**
 * Context provider that gives access to a list of favourite signals.
 * @param {*} props
 */
export function FavouritesProvider(props) {
  const { children } = props

  const [favourites, setFavourites] = useState([])
  useEffect(() => {
    const fetch = async () => {
      const { data } = await cms.get(`/signals?favourite=true`)
      setFavourites(data)
    }
    fetch()
  }, [])

  async function toggleFavourite(signal) {
    const favourite = favourites.find(f => f.mnemonic === signal.mnemonic)
    if (!favourite) {
      let { data: [ newFavourite ] } = await cms.get(`/signals?mnemonic=${signal.mnemonic}`)
      if (!newFavourite) {
        newFavourite = {
          name: signal.name,
          units: signal.units,
          mnemonic: signal.mnemonic,
          favourite: true,
        }
        if (signal.values) {
          newFavourite.values = Object.keys(signal.values).map(i => ({ value: i, label: signal.values[i]}))
        }
        let { data } = await cms.post('/signals', newFavourite)
        newFavourite = data
      } else {
        newFavourite.favourite = true
        cms.put(`/signals/${newFavourite.id}`, newFavourite)
      }
      setFavourites(favourites.concat(newFavourite))
    } else {
      setFavourites(favourites.filter(f => (f !== favourite)))
      cms.put(`/signals/${favourite.id}`, { ...favourite, favourite: false })
    }
  }

  function isFavourite(signal) {
    return favourites.findIndex(f => f.mnemonic === signal.mnemonic) !== -1
  }

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  )
}
