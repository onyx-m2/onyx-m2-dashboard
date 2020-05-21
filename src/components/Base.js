import styled from 'styled-components'

export const ScrollContainer = styled.div`
  overflow-y: scroll;
  will-change: scroll-position;
  margin: 0 !important;
`

export const Tile = styled.div`
  text-transform: uppercase;
  overflow: auto;
  background: #FFFFFF;
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