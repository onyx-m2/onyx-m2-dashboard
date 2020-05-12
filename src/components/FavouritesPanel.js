import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Menu, Segment, Header } from 'semantic-ui-react'
import './FavouritesPanel.css'
import Signal from './Signal'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useDrag, DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import M2 from '../contexts/M2'
import { FavouritesContext } from '../contexts/FavouritesContext'

/**
 * Component that displays ...
 * @component
 */
export default function FavouritesPanel() {
  const { favourites } = useContext(FavouritesContext)
  return (
    <div className='FavouritesPanel'>
      <DndProvider backend={Backend}>
      {favourites.map(mnemonic => (
        <SignalCard key={mnemonic} signal={mnemonic} />
      ))}
      </DndProvider>
    </div>
  )
}

function SignalCard(props) {
  const { signal } = props
  const [collectedProps, drag] = useDrag({
    item: { type: 'card' },
  })
  return (
    <Segment ref={drag}>
      <Signal mnemonic={signal} />
    </Segment>
  )
}