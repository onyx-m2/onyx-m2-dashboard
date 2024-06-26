import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { SignalSlab } from './Signal'
import { useParams, useNavigate } from 'react-router-dom'
import { M2 } from 'onyx-m2-react'
import Grid from './Grid'
import { ScrollContainer, Tile } from './Base'
import styled from 'styled-components'
import Favourites from '../contexts/Favourites'

/**
 * Component that displays a fullscreen panel that allows browsing all the messages
 * and signals declared in the loaded DBC, and display their realtime value. The
 * browser uses the url location to know what category and message to display.
 * @component
 */
export default function SignalBrowser(props) {
  const { dbc } = useContext(M2)
  const { isFavourite, toggleFavourite } = useContext(Favourites)
  const navigate = useNavigate()
  const { categorySlug, messageSlug } = useParams()
  let category = dbc.getCategory(categorySlug)
  let message = dbc.getMessageFromSlugs(categorySlug, messageSlug)
  let redirect = false
  if (!category) {
    category = dbc.getFirstCategory()
    redirect = true
  }
  if (!message) {
    message = dbc.getFirstCategoryMessage(category.slug)
    redirect = true
  }
  if (redirect) {
    navigate(`${props.basePath}/${category.slug}/${message.slug}`, { replace: true })
  }

  function onCategorySelected(e, slug) {
    if (slug !== category.slug) {
      navigate(`${props.basePath}/${slug}`)
      e.stopPropagation()
    }
  }

  function onMessageSelected(e, slug) {
    if (slug !== message.slug) {
      navigate(`${props.basePath}/${category.slug}/${slug}`)
      e.stopPropagation()
    }
  }

  function onFavouriteToggled(e, mnemonic) {
    e.stopPropagation()
    toggleFavourite(mnemonic)
  }

  const categories = dbc.getCategories()
  let messages = dbc.getCategoryMessages(categorySlug)
  let signals = dbc.getMessageSignals(message.mnemonic)
  return (
    <Grid gap='10px' row={1} columns={3}>
      <ScrollContainer as={Tile}>
        {categories.map(c => (
          <ListItem
            uppercase
            key={c.slug}
            selected={c.slug === category.slug}
            onClick={e => onCategorySelected(e, c.slug)}
          >
            <ListItem.Header>{c.slug}</ListItem.Header>
            {c.name}
          </ListItem>
        ))}
      </ScrollContainer>
      <ScrollContainer as={Tile}>
        {messages.map(m => (
          <ListItem
            uppercase
            key={m.slug}
            selected={m.slug === message.slug}
            onClick={e => onMessageSelected(e, m.slug)}
          >
            <ListItem.Header>{m.id}</ListItem.Header>
            {m.name}
          </ListItem>
        ))}
      </ScrollContainer>
      <ScrollContainer as={Tile} uppercase>
        {signals.map(({ mnemonic }) => (
          <SignalSlab
            key={mnemonic}
            mnemonic={mnemonic}
            icon={isFavourite(mnemonic) ? 'olive star' : ''}
            onClick={e => onFavouriteToggled(e, mnemonic)}
          />
        ))}
      </ScrollContainer>
    </Grid>
  )
}

SignalBrowser.propTypes = {
  /**
   * Base url path where the browser is mounted
   */
  basePath: PropTypes.string.isRequired,
}

const ListItem = styled.div`
  position: relative;
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'none')};

  background: ${props => (props.selected ? props.theme.background.selected : 'none')};
  font-weight: ${props => (props.selected ? 700 : 400)};

  cursor: pointer;
  padding: 18px;

  &:before {
    position: absolute;
    content: '';
    top: 0%;
    left: 0px;
    width: 100%;
    height: 1px;
    background: ${props => props.theme.divider};
  }

  &:first-child:before {
    display: none;
  }
`
ListItem.propTypes = {
  uppercase: PropTypes.bool,
}

ListItem.Header = styled.h4`
  color: grey;
  font-size: 12px;
`
