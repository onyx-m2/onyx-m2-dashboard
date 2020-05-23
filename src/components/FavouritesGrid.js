import React, { useContext, useState, useRef, useEffect, useMemo, forwardRef } from 'react'
import PropTypes from 'prop-types'
import Signal from './Signal'
import { FavouritesContext } from '../contexts/FavouritesContext'
import { Grid, Cell } from 'styled-css-grid'
import { useDrag } from 'react-use-gesture'
import { Tile } from './Base'
import styled from 'styled-components'
import { clamp } from '../utils/utils'

const GRID_ROWS = 8
const GRID_COLUMNS = 6
const GRID_GAP = 20

/**
 * Component that displays ...
 * @component
 */
export default function FavouritesGrid() {
  const { favourites, moveFavourite } = useContext(FavouritesContext)
  const gap = `${GRID_GAP}px`
  const placeholderRef = useRef(null)
  const tilesRef = useRef([])
  const [ placeholdersVisible, setPlaceholdersVisible ] = useState(false)

  const drag = useDrag(({ args: [favourite, ref], event, down, movement: [dx, dy] }) => {
    const { style } = tilesRef.current[ref]
    if (down) {
      setPlaceholdersVisible(true)
      style.zIndex = 1
      style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    } else {
      setPlaceholdersVisible(false)
      style.zIndex = 0
      style.transform = `translate3d(0, 0, 0)`
      const { clientWidth: cellWidth, clientHeight: cellHeight } = placeholderRef.current
      moveFavourite(
        favourite.signal,
        clamp(favourite.left + (dx / (cellWidth + GRID_GAP)), 1, 6 - favourite.width + 1),
        clamp(favourite.top + (dy / (cellHeight  + GRID_GAP)), 1, 8 - favourite.height + 1)
      )
    }
    event.stopPropagation()
  })

  const gridCells = useMemo(() => {
    const cells = []
    for (let row = 1; row <= GRID_ROWS; row++) {
      for (let col = 1; col <= GRID_COLUMNS; col++) {
        cells.push({row, col})
      }
    }
    return cells
  })

  return (
    <Grid gap={gap} rows={GRID_ROWS} columns={GRID_COLUMNS}>
      {gridCells.map(p => (
        <PlaceholderCell ref={placeholderRef} visible={placeholdersVisible} key={`${p.row}x${p.col}`} left={p.col} top={p.row} width={1} height={1} />
      ))}
      {favourites.map((f, i) => (
        <SignalTile as={Cell} ref={el => tilesRef.current[i] = el} {...drag(f, i)} left={f.left} top={f.top} width={2} key={f.signal} signal={f.signal} />
      ))}
    </Grid>
  )
}

const PlaceholderCell = styled(Cell)`
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  border: dashed ${props => props.theme.text.disabled} 2px;
  border-radius: 10px;
`

const SignalTile = forwardRef((props, ref) => {
  const { signal } = props
  return (
    <Tile ref={ref} {...props} >
      <Signal mnemonic={signal} />
    </Tile>
  )
})
