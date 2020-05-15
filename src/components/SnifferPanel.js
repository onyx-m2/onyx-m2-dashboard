import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Menu, Segment, Header, Icon } from 'semantic-ui-react'
import Signal from './Signal'
import { Link, useParams, useHistory } from 'react-router-dom'
import M2 from '../contexts/M2'
import { FavouritesContext } from '../contexts/FavouritesContext'
import { Grid, Cell } from 'styled-css-grid'
import styled from 'styled-components'

/**
 * Component that displays ...
 * @component
 */
export default function SnifferPanel() {
  return (
    <Grid rows={1} columns={1} >
      <Cell as={SnifferSegment}>
        <Icon size='massive' name='braille' />
      </Cell>
    </Grid>
  )
}

const SnifferSegment = styled(Segment)`
  width: 100%;
`