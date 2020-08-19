import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { SignalSlab } from './Signal'
import { useParams, useHistory } from 'react-router-dom'
import M2 from '../contexts/M2'
import { Grid } from 'styled-css-grid'
import { ScrollContainer, Tile } from './Base'
import styled, { ThemeContext } from 'styled-components'
import CMS from '../contexts/CMS'

/**
 * Component that displays a fullscreen panel that allows browsing all the messages
 * and signals declared in the loaded DBC, and display their realtime value. The
 * browser uses the url location to know what category and message to display.
 * @component
 */
export default function SignalBrowser(props) {
  const { dbc } = useContext(M2)
  const { isFavourite, toggleFavourite } = useContext(CMS)
  const history = useHistory()
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
    history.replace(`${props.basePath}/${category.slug}/${message.slug}`)
  }

  const theme = useContext(ThemeContext)

  function onCategorySelected(e, slug) {
    if (slug !== category.slug) {
      history.push(`${props.basePath}/${slug}`)
      e.stopPropagation()
    }
  }

  function onMessageSelected(e, slug) {
    if (slug !== message.slug) {
      history.push(`${props.basePath}/${category.slug}/${slug}`)
      e.stopPropagation()
    }
  }

  function onFavouriteToggled(e, signal) {
    e.stopPropagation()
    toggleFavourite(signal)
  }

  const categories = dbc.getCategories()
  let messages = dbc.getCategoryMessages(categorySlug)
  let signals = dbc.getMessageSignals(message.mnemonic)
  return (
    <Grid gap='20px' row={1} columns={3}>
      <ScrollContainer as={Tile}>
        {categories.map(c => (
            <ListItem uppercase key={c.slug} selected={c.slug === category.slug} onClickCapture={(e) => onCategorySelected(e, c.slug)}>
              <ListItem.Header>{c.slug}</ListItem.Header>
              {c.name}
            </ListItem>
        ))}
      </ScrollContainer>
      <ScrollContainer as={Tile}>
        {messages.map(m => (
          <ListItem uppercase key={m.slug} selected={m.slug === message.slug} onClickCapture={(e) => onMessageSelected(e, m.slug)}>
            <ListItem.Header>{m.id}</ListItem.Header>
            {m.name}
          </ListItem>
        ))}
      </ScrollContainer>
      <ScrollContainer as={Tile} uppercase>
        {signals.map(s => (
          <SignalSlab key={s.mnemonic} mnemonic={s.mnemonic} icon={isFavourite(s) ? 'olive star' : ''} onClickCapture={(e) => onFavouriteToggled(e, s)} />
        ))}
      </ScrollContainer>
    </Grid>
  )
}

SignalBrowser.propTypes = {
  /**
   * Base url path where the browser is mounted
   */
  basePath: PropTypes.string.isRequired
}

const ListItem = styled.div`
  position: relative;
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};

  background: ${props => props.selected ? props.theme.background.selected : 'none'};
  font-weight: ${props => props.selected ? 700 : 400};

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

ListItem.Header = styled.h4`
  color: grey;
  font-size: 12px;
`
