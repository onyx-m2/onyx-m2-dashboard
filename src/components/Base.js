import styled from 'styled-components'

export const Panel = styled.div`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  padding: 10px 20px 20px 20px;
  display: flex;
  background-color: ${props => props.theme.background.panel};
`

export const ScrollContainer = styled.div`
  overflow-y: scroll;
  will-change: scroll-position;
  margin: 0 !important;
`

export const Tile = styled.div`
  text-transform: uppercase;
  overflow: auto;
  color: ${props => props.theme.text.dark};
  background: ${props => props.theme.background.component};
  box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12), 0 2px 10px 0 rgba(34, 36, 38, 0.15);
  border-radius: 10px;
  border: none;
  user-select: none;
`
export const DraggableTile = styled(Tile)`
  cursor: grab;
  &:active {
    cursor: move;
  }
`
export const Spinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 260px;
  height: 260px;
  transform: translateX(-50%) translateY(-50%);
  background-image: ${props => props.image ? 'url(' + props.image + ')' : ''};
  background-repeat: no-repeat;
  background-position: center;

  &:before {
    content: '';
    position: absolute;
    top: 0%;
    left: 50%;
    width: 260px;
    height: 260px;
    margin-left: -130px;
    border-radius: 200px;
    border: 10px solid rgba(${props => props.colour}, 0.1);
  }

  &:after {
    content: '';
    position: absolute;
    top: 0%;
    left: 50%;
    width: 260px;
    height: 260px;
    margin-left: -130px;
    animation: loader 0.8s linear;
    animation-iteration-count: infinite;
    border-radius: 200px;
    border-color: rgba(${props => props.colour}) transparent transparent;
    border-style: solid;
    border-width: 10px;
    box-shadow: 0px 0px 0px 1px transparent;
  }
`