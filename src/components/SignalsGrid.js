import React, { useContext, useState, useRef, useEffect, useMemo, forwardRef } from 'react'
import PropTypes from 'prop-types'
import Signal from './Signal'
import { FavouritesContext } from '../contexts/FavouritesContext'
import { Grid, Cell } from 'styled-css-grid'
import { useDrag } from 'react-use-gesture'
import { Tile, Spinner } from './Base'
import styled from 'styled-components'
import { clamp } from '../utils/utils'
import { useParams } from 'react-router-dom'
import { m2, cms } from '../utils/services'

const GRID_ROWS = 8
const GRID_COLUMNS = 6
const GRID_GAP = 20

/**
 * Component that displays ...
 * @component
 */
export default function SignalsGrid(props) {

  //const { grid } = props
  const [ grid, setGrid ] = useState(props.grid)
  useEffect(() => setGrid(props.grid), [props.grid.id])
  // const { id } = useParams()
  // const [ grid, setGrid ] = useState(null)
  // useEffect(() => {
  //   const fetch = async () => {
  //     const { data } = await cms.get(`/grids/${id}`)
  //     setGrid(data)
  //   }
  //   fetch()
  // }, [id])

  function moveTile(tile, left, top) {
    const updatedTile = { ...tile.tile, left, top }
    const updatedGrid = {
      ...grid,
      tiles: grid.tiles.map(t => {
        if (t === tile) {
          return { ...t, tile: updatedTile }
        }
        return t
      })
    }
    setGrid(updatedGrid)
    //cms.put(`/tiles/${tile.id}`, updatedTile)
  }

  function removeTile(tile) {
    //cms.delete(`/tiles/${tile.id}`)
    //setTiles(tiles.filter(t => t !== tile))
  }

  const gap = `${GRID_GAP}px`
  const placeholderRef = useRef(null)
  const tilesRef = useRef([])
  const [ placeholdersVisible, setPlaceholdersVisible ] = useState(false)
  const [ selectedTileId, setSelectedTileId ] = useState(0)

  const drag = useDrag(({ args: [tile, ref], event, tap, down, movement: [dx, dy] }) => {
    const { style } = tilesRef.current[ref]
    if (tap) {
      setSelectedTileId(selectedTileId !== tile.id ? tile.id : 0)
    }
    if (down) {
      if (dx || dy) {
        setPlaceholdersVisible(true)
      }
      style.zIndex = 1
      style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    } else {
      setPlaceholdersVisible(false)
      style.zIndex = 0
      style.transform = `translate3d(0, 0, 0)`
      const { clientWidth: cellWidth, clientHeight: cellHeight } = placeholderRef.current
      moveTile(
        tile,
        clamp(tile.tile.left + (dx / (cellWidth + GRID_GAP)), 1, 6 - tile.tile.width + 1),
        clamp(tile.tile.top + (dy / (cellHeight  + GRID_GAP)), 1, 8 - tile.tile.height + 1)
      )
    }
    event.stopPropagation()
  })

  const gridCells = useMemo(() => {
    console.log('compute')
    const cells = []
    for (let row = 1; row <= GRID_ROWS; row++) {
      for (let col = 1; col <= GRID_COLUMNS; col++) {
        cells.push({row, col})
      }
    }
    return cells
  }, [])

  if (grid === null) {
    return <Spinner colour='201,0,0' image='/favicon.png' />
  }

  return (
    <FullWidthGrid gap={gap} rows={GRID_ROWS} columns={GRID_COLUMNS}>
      {gridCells.map(p => (
        <PlaceholderCell
          key={`${p.row}x${p.col}`}
          ref={placeholderRef}
          visible={placeholdersVisible}
          left={p.col} top={p.row} width={1} height={1}
        />
      ))}
      {grid.tiles.filter(t => t.__component === 'tile-components.signal-tile').map((t, i) => (
        <SignalTile as={Cell}
          selected={selectedTileId === t.id}
          key={t.id}
          ref={el => tilesRef.current[i] = el}
          left={t.tile.left} top={t.tile.top} width={t.tile.width} height={t.tile.height}
          signal={t.signal}
          caption={t.tile.caption}
          {...drag(t, i)}
        />
      ))}
    </FullWidthGrid>
  )
}

const FullWidthGrid = styled(Grid)`
  width: 100vw;
`

const PlaceholderCell = styled(Cell)`
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  border: dashed ${props => props.theme.text.disabled} 2px;
  border-radius: 10px;
`

const SignalTile = forwardRef((props, ref) => {
  const { caption, signal, selected } = props
  return (
    <Tile ref={ref} {...props} selected={selected} >
      <Signal mnemonic={signal.mnemonic} caption={caption || signal.name} />
    </Tile>
  )
})

const ComputedSignalTile = forwardRef((props, ref) => {
  const { caption, id, selected } = props
  const [ signal, setSignal ] = useState()
  useEffect(() => {
    const fetch = async () => {
      const { data } = await cms.get(`/signals/${id}`)
      setSignal(data)
    }
    fetch()
  }, [id])
  if (signal) {
    return (
      <Tile ref={ref} {...props} selected={selected} >
        <Signal mnemonic={signal.definition[0].value} caption={caption || signal.name} />
      </Tile>
    )
  }
})
