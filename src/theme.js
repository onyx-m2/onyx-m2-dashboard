const TESLA_BLUE = 'rgb(62, 106, 225)' // Primary color found on their website

/**
 * Day time light theme
 */
export const DAY_THEME = {
  name: 'day',
  primary: TESLA_BLUE,
  text: {
    dark: 'rgba(0, 0, 0, 0.85)',
    muted: 'rgba(0, 0, 0, 0.6)',
    light: 'rgba(0, 0, 0, 0.4)',
    unselected: 'rgba(0, 0, 0, 0.4)',
    hovered: 'rgba(0, 0, 0, 0.8)',
    pressed: 'rgba(0, 0, 0, 0.9)',
    selected: 'rgba(0, 0, 0, 0.95)',
    disabled: 'rgba(0, 0, 0, 0.2)'
  },
  background: {
    panel: '#fafafa',
    component: 'white',
    button: '#E0E1E2',
    selected: 'rgba(0, 0, 0, 0.05)'
  },
  divider: 'rgba(34, 36, 38, 0.1)'
}

/**
 * Night time dark theme
 */
export const NIGHT_THEME = {
  name: 'night',
  primary: 'rgb(62, 106, 225)',
  text: {
    dark: 'rgba(255, 255, 255, 0.9)',
    muted: 'rgba(255, 255, 255, 0.8)',
    light: 'rgba(255, 255, 255, 0.7)',
    unselected: 'rgba(255, 255, 255, 0.5)',
    hovered: 'rgba(255, 255, 255, 1)',
    pressed: 'rgba(255, 255, 255, 1)',
    selected: 'rgba(255, 255, 255, 1)',
    disabled: 'rgba(255, 255, 255, 0.2)'
  },
  background: {
    panel: 'rgb(9, 9, 9)',
    component: 'rgb(27, 28, 29)',
    button: '#E0E1E2',
    selected: 'rgba(255, 255, 255, 0.15);'
  },
  divider: 'rgba(255, 255, 255, 0.08)'
}

/**
 * Instrument cluster theme (super black)
 */
export const INSTRUMENTS_THEME = {
  name: 'instruments',
  primary: 'white',
  scale: {
    white: 'rgb(255, 255, 255, 0.8)',
    yellow: 'rgb(251, 190, 8, 0.8)',
    orange: 'rgb(242, 113, 28, 0.8)',
    red: 'rgb(219, 40, 40, 0.8)',
    green: 'rgb(33, 186, 69, 0.8)'
  },
  indicator: {
    grey: 'rgb(255, 255, 255, 0.7)',
    white: 'rgb(255, 255, 255, 1.0)',
    yellow: 'rgb(251, 190, 8, 1.0)',
    orange: 'rgb(242, 113, 28, 1.0)',
    red: 'rgb(219, 40, 40, 1.0)',
    green: 'rgb(33, 186, 69, 1.0)',
    blue: TESLA_BLUE,
  },
  font: {
    size: {
      hero: '64px',
      large: '36px',
      medium: '24px',
      small: '14px'
    },
  },
  text: {
    dark: 'rgba(255, 255, 255, 0.9)',
    muted: 'rgba(255, 255, 255, 0.8)',
    light: 'rgba(255, 255, 255, 0.7)',
    unselected: 'rgba(255, 255, 255, 0.5)',
    hovered: 'rgba(255, 255, 255, 1)',
    pressed: 'rgba(255, 255, 255, 1)',
    selected: 'rgba(255, 255, 255, 1)',
    disabled: 'rgba(255, 255, 255, 0.2)'
  },
  background: {
    panel: 'black',
    component: 'black',
    button: '#E0E1E2',
    selected: 'rgba(255, 255, 255, 0.15);'
  },
  divider: 'rgba(255, 255, 255, 0.08)',
  colours: {
    green: 'rgb(91, 194, 54)',

  },
  circular: {
    size: '320px',
    colour: 'white'
  },
  linear: {

  }
}
