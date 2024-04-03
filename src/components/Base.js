import styled from 'styled-components'
import PropTypes from 'prop-types'

export const Panel = styled.div`
  position: relative;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  padding: 10px;
  display: flex;
  background-color: ${props => props.theme.background.panel};
`

export const ScrollContainer = styled.div`
  overflow: auto;
  will-change: scroll-position;
  margin: 0 !important;

  /* position: relative;
  &:after {
    content  : "";
    position : absolute;
    z-index  : 1;
    bottom   : 0;
    left     : 0;
    pointer-events   : none;
    background-image : linear-gradient(to bottom,
                      rgba(255,255,255, 0),
                      rgba(255,255,255, 1) 90%);
    width    : 100%;
    height   : 4em;
  } */
`

export const Tile = styled.div`
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'none')};
  color: ${props => props.theme.text.dark};
  background: ${props => props.theme.background.component};
  box-shadow: ${props =>
    props.selected
      ? `0 0 0 4px ${props.theme.primary}`
      : '0 2px 4px 0 rgba(34, 36, 38, 0.12), 0 2px 10px 0 rgba(34, 36, 38, 0.15)'};
  border-radius: 2px;
  border: none;
  user-select: none;
`
Tile.propTypes = {
  uppercase: PropTypes.bool,
}

export const DraggableTile = styled(Tile)`
  cursor: grab;
  &:active {
    cursor: move;
  }
`

export const Spinner = styled.div`
  position: relative;
  margin: auto;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-image: ${props => (props.image ? 'url(' + props.image + ')' : '')};
  background-repeat: no-repeat;
  background-position: center;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    border-radius: 200px;
    border: ${props => Math.max(4, props.size / 20)}px solid rgba(${props => props.colour}, 0.1);
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    animation: loader 0.8s linear;
    animation-iteration-count: infinite;
    border-radius: 200px;
    border-color: rgba(${props => props.colour}) transparent transparent;
    border-style: solid;
    border-width: ${props => Math.max(4, props.size / 20)}px;
    box-shadow: 0px 0px 0px 1px transparent;
  }
`

export const Wrapper = styled.div`
  display: contents;
`

export const Button = styled.button`
  cursor: pointer;
  display: inline-block;
  min-height: 1em;
  border: none;
  vertical-align: baseline;
  color: ${props => (props.primary ? 'white' : props.theme.text.muted)};
  background-color: ${props =>
    props.primary ? props.theme.primary : props.theme.background.button};
  margin: 0;
  padding: 0.55em ${props => (props.rounded ? 0.55 : 1.5)}em 0.55em;
  text-transform: uppercase;
  text-shadow: none;
  font-weight: bold;
  line-height: 1em;
  font-style: normal;
  text-align: center;
  user-select: none;
  outline: 0;
  border-radius: ${props => (props.rounded ? '200px' : '10px')};
  box-shadow: ${props =>
    props.raised
      ? '3px 7px 10px 0 rgba(34, 36, 38, 0.52)'
      : '0px 0px 0px 1px transparent inset, 0px 0em 0px 0px rgba(34, 36, 38, 0.15) inset'};
`
