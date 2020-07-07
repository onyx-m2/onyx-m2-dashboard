import React, { createContext, useState } from 'react'
import { cms } from '../utils/services'

const CMS = createContext()
export default CMS

const STATE_NEW = 'new'
const STATE_TOGGLED = 'toggled'

/**
 * Context provider that gives access to a list of favourite signals.
 * @param {*} props
 */
export function CMSProvider(props) {
  const { children } = props
  const [ signals, setSignals ] = useState(props.signals)
  const [ favourites, setFavourites ] = useState(props.signals.filter(s => s.favourite))
  const [ grids, setGrids ] = useState(props.menu.grids.map(g => ({...g, slug: g.name.toLowerCase()})))
  const [ modified, setModified ] = useState(false)
  const [ saving, setSaving ] = useState(false)

  async function toggleFavourite(dbcSignal) {
    let signal = signals.find(s => s.mnemonic === dbcSignal.mnemonic)
    if (!signal) {
      signal = {
        name: dbcSignal.name,
        units: dbcSignal.units,
        mnemonic: dbcSignal.mnemonic,
        state: STATE_NEW,
        favourite: true,
      }
      if (dbcSignal.values) {
        signal.values = Object.keys(dbcSignal.values).map(i => ({ value: i, label: signal.values[i]}))
      }
      setSignals(signals.concat(signal))
    }
    else {
      setSignals(signals.map(s => {
        if (s === signal) {
          return {
            ...signal,
            favourite: !signal.favourite,
            state: STATE_TOGGLED
          }
        }
        return s
      }))
    }
    setFavourites(signals.filter(s => s.favourite))
    setModified(true)
  }

  function isFavourite(signal) {
    return favourites.findIndex(s => s.mnemonic === signal.mnemonic) !== -1
  }

  function moveGridTile(grid, tileId, left, top) {
    const updatedGrid = {
      ...grid,
      modified: true,
      tiles: grid.tiles.map(t => {
        if (t.id == tileId) {
          return { ...t, tile: { ...t.tile, left, top } }
        }
        return t
      })
    }
    setGrids(grids.map(g => {
      if (g.id === grid.id) {
        return updatedGrid
      }
      return g
    }))
    setModified(true)
  }

  async function saveModified() {
    const updates = []
    setSaving(true)
    grids.filter(g => g.modified).forEach(g => {
      updates.push(cms.put(`/grids/${g.id}`, g))
    })
    signals.filter(s => s.state == STATE_NEW).forEach(s => {
      updates.push(cms.post(`/signals`, s))
    })
    signals.filter(s => s.state == STATE_TOGGLED).forEach(s => {
      updates.push(cms.put(`/signals/${s.id}`, { favourite: s.favourite }))
    })
    await Promise.all(updates)
    setModified(false)
    setSaving(false)
  }

  return (
    <CMS.Provider value={{ favourites, isFavourite, toggleFavourite, grids, moveGridTile, modified, saving, saveModified }}>
      {children}
    </CMS.Provider>
  )
}
