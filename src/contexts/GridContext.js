import React, { createContext } from 'react'

const GridContext = createContext()
export default GridContext

/**
 * Context provider that gives access to host's gird parameters. Somewhat needed to work
 * around dynamic sizing limitation, especially for svg.
 * @param {*} props
 */
export function GridContextProvider(props) {
  const { cellWidth, cellHeight, gapSize, children } = props

  function calcWidth(width) {
    return (width * cellWidth) + ((width - 2) * gapSize)
  }

  function calcHeight(height) {
    return (height * cellHeight) + ((height - 2) * gapSize)
  }

  return (
    <GridContext.Provider value={{ calcWidth, calcHeight }}>
      {children}
    </GridContext.Provider>
  )
}
