import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Menu, Segment, Header, Icon } from 'semantic-ui-react'
import './SnifferPanel.css'
import Signal from './Signal'
import { Link, useParams, useHistory } from 'react-router-dom'
import M2 from '../contexts/M2'
import { FavouritesContext } from '../contexts/FavouritesContext'

/**
 * Component that displays ...
 * @component
 */
export default function SnifferPanel() {
  return (
    <Segment className='SnifferPanel'>
      <Icon size='massive' name='braille' />
    </Segment>
  )
}
