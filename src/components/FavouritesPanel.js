import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Signal from './Signal'
import { FavouritesContext } from '../contexts/FavouritesContext'
import { Grid, Cell } from 'styled-css-grid'
import { useDrag } from 'react-use-gesture'
import { DraggableTile } from './Base'
import styled from 'styled-components'

/**
 * Component that displays ...
 * @component
 */
export default function FavouritesPanel() {
  const { favourites } = useContext(FavouritesContext)
  return (
    <Grid gap='20px' rows={8} columns={6}>
      {favourites.map(mnemonic => (
          <SignalTile key={mnemonic} signal={mnemonic} />
      ))}
    </Grid>
  )
}

function SignalTile(props) {
  const { signal } = props
  const [ dragOffset, setDragOffset ] = useState({ x: 0, y: 0 })
  const drag = useDrag(({ event, offset: [x, y] }) => {
    setDragOffset({x, y})
    event.stopPropagation()
  })
  return (
    <DraggableTile as={Cell} width={2} {...drag()} to={dragOffset} >
      <Signal mnemonic={signal} />
    </DraggableTile>
  )
}
