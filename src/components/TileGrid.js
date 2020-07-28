import React, { useContext, useState, useRef, useEffect, useMemo, forwardRef, createContext, Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import { Grid, Cell } from 'styled-css-grid'
import { useDrag } from 'react-use-gesture'
import styled from 'styled-components'
import { clamp } from '../utils/utils'
import M2 from '../contexts/M2'

const DEFAULT_ROWS = 8
const DEFAULT_COLUMNS = 6
const GRID_GAP = 20

/**
 * Component that displays ...
 * @component
 */
export default function TileGrid(props) {
  const { freeze } = useContext(M2)
  const { rows, columns, children, onTileMoved, onTileTapped } = props

  const placeholderRef = useRef(null)
  const tilesRef = useRef([])
  const [ placeholdersVisible, setPlaceholdersVisible ] = useState(false)
  const [ selectedTileId, setSelectedTileId ] = useState(0)

  const drag = useDrag(({ args: [tile, ref], event, tap, down, movement: [dx, dy] }) => {
    const { style } = tilesRef.current[ref]
    if (onTileTapped && tap) {
      const selected = selectedTileId !== tile.key
      setSelectedTileId(selected ? tile.key : 0)
      onTileTapped(tile.key, selected)
    }
    if (onTileMoved) {
      if (down) {
        freeze(true)
        if (dx || dy) {
          setPlaceholdersVisible(true)
        }
        style.zIndex = 1
        style.transform = `translate3d(${dx}px, ${dy}px, 0)`
      } else {
        setPlaceholdersVisible(false)
        freeze(false)
        style.zIndex = 0
        style.transform = `translate3d(0, 0, 0)`
        const { clientWidth: cellWidth, clientHeight: cellHeight } = placeholderRef.current
        onTileMoved(
          tile.key,
          clamp(tile.props.left + (dx / (cellWidth + GRID_GAP)), 1, columns - tile.props.width + 1),
          clamp(tile.props.top + (dy / (cellHeight  + GRID_GAP)), 1, rows - tile.props.height + 1)
        )
      }
    }
    event.stopPropagation()
  })

  const gridCells = useMemo(() => {
    const cells = []
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= columns; col++) {
        cells.push({row, col})
      }
    }
    return cells
  }, [])

  return (
    <FullWidthGrid gap={`${GRID_GAP}px`} rows={rows} columns={columns}>
      {gridCells.map(p => (
        <PlaceholderCell
          key={`${p.row}x${p.col}`}
          ref={placeholderRef}
          visible={placeholdersVisible}
          left={p.col} top={p.row} width={1} height={1}
        />
      ))}
      {Children.map(children, (child, i) => cloneElement(child, {
        width: 2,
        height: 1,
        left: 1,
        top: 1,
        as: Cell,
        ref: el => tilesRef.current[i] = el,
        ...drag(child, i),
        ...child.props
      }))}
    </FullWidthGrid>
  )
}

TileGrid.defaultProps = {
  rows: DEFAULT_ROWS,
  columns: DEFAULT_COLUMNS
}

TileGrid.Tile = styled.div`
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  overflow: hidden;
  color: ${props => props.theme.text.dark};
  background: ${props => props.theme.background.component};
  box-shadow: ${props => props.selected ?
    `0 0 0 4px ${props.theme.primary}` :
    '0 2px 4px 0 rgba(34, 36, 38, 0.12), 0 2px 10px 0 rgba(34, 36, 38, 0.15)'
  };
  border-radius: 10px;
  border: none;
  user-select: none;
`

const FullWidthGrid = styled(Grid)`
  width: 100vw;
`

const PlaceholderCell = styled(Cell).attrs(props => ({
  style: {
    visibility: props.visible ? 'visible' : 'hidden'
  }
}))`
  border: dashed ${props => props.theme.text.disabled} 2px;
  border-radius: 10px;
`
