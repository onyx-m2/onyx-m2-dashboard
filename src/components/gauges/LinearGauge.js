import React, { Children, cloneElement } from 'react'
import styled from 'styled-components'


// SVG doesn't seem to want to play nice with dynamic sizing (which is ironic for a
// scalable vector format), so we'll have to pass in the length of the gauge.

// from, to
// ranges: [{ from, to, color}]
// markers: [{ value, color }]
export default function LinearGauge(props) {
  const { from, to, invert, length, children } = props
  const scaling = invert ? 'scale(-1, 1)' : ''
  const offset = -from
  const interval = length / (to - from)
  const min = from
  const max = to
  return (
    <svg transform={scaling} width={length} height={20}>
      {Children.map(children, c => cloneElement(c, {
        ...c.props, offset, interval, min, max
      }))}
    </svg>
  )
}

export function Ranges(props) {
  return (
    <g>
      {props.children}
    </g>
  )
}

export function Range(props) {
  const { from, to, color, offset, interval, min, max } = props

  var x1 = from
  if (from !== min) {
    x1 += 1
  }
  x1 = (x1 + offset) * interval

  var x2 = to
  if (to !== max) {
    x2 -= 1
  }
  x2 = (x2 + offset) * interval

  return (
    <AnimatedRect x={x1} y={6} width={x2 - x1} height={3} fill={color} />
  )
}

const AnimatedRect = styled.rect`
  transition: all 0.3s ease;
`

export function Marker(props) {
  const { value, color, offset, interval, min, max } = props
  var x = value
  if (x < min) {
    x = min
  }
  if (x > max) {
    x = max
  }
  x = (x + offset) * interval
  return (
    <AnimatedPath d='M -8 16 L 0 0 L 8 16 Z'
      fill={color}
      stroke='black'
      stroke-width='2'
      stroke-linecap='square'
      transform={`translate(${x}, -2)`}
    />
  )
}

const AnimatedPath = styled.path`
  transition: all 0.3s ease;
`