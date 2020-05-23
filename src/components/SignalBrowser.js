import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Menu, Header } from 'semantic-ui-react'
import Signal from './Signal'
import { Link, useParams, useHistory } from 'react-router-dom'
import M2 from '../contexts/M2'
import { FavouritesContext } from '../contexts/FavouritesContext'
import { Grid } from 'styled-css-grid'
import { ScrollContainer, Tile } from './Base'
import styled, { ThemeContext } from 'styled-components'

/**
 * Component that displays a fullscreen panel that allows browsing all the messages
 * and signals declared in the loaded DBC, and display their realtime value. The
 * browser uses the url location to know what category and message to display.
 * @component
 */
export default function SignalBrowser(props) {
  const { dbc } = useContext(M2)
  const { isFavourite, toggleFavourite } = useContext(FavouritesContext)
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

  const categories = dbc.getCategories()
  let messages = dbc.getCategoryMessages(categorySlug)
  let signals = dbc.getMessageSignals(message.mnemonic)
  return (
    <Grid gap='20px' row={1} columns={3}>
      <ScrollContainer as={Menu} fluid vertical inverted={theme.name === 'night'}>
        {categories.map(c => (
          <MenuItem key={c.slug} slug={c.slug} header={c.slug} name={c.name} selected={c.slug === category.slug} />
        ))}
      </ScrollContainer>
      <ScrollContainer as={Menu} fluid vertical inverted={theme.name === 'night'}>
        {messages.map(m => (
          <MenuItem key={m.slug} slug={category.slug + '/' + m.slug} header={m.id} name={m.name} selected={m.slug === message.slug} />
        ))}
      </ScrollContainer>
      <Tile>
        {signals.map(s => (
          <Signal key={s.mnemonic} mnemonic={s.mnemonic} icon={isFavourite(s.mnemonic) ? 'olive star' : ''} onClick={() => toggleFavourite(s.mnemonic)} />
        ))}
      </Tile>
    </Grid>
  )
}

SignalBrowser.propTypes = {
  /**
   * Base url path where the browser is mounted
   */
  basePath: PropTypes.string.isRequired
}

function MenuItem(props) {
  const { slug, header, name, selected } = props
  return (
    <Menu.Item as={UpperCaseLink} to={`../${slug}`} active={selected}>
      <Header size='tiny' as='h4' color='grey' content={header} />
      {name}
    </Menu.Item>
  )
}

const UpperCaseLink = styled(Link)`
  text-transform: uppercase !important;
`