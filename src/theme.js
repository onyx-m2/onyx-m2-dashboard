
/**
 * Day time light theme
 */
export const DAY_THEME = {
  name: 'day',

  // The primary color is the 'Tesla Blue' found on their website
  primary: 'rgb(62, 106, 225)',

  // Various text colours for light theme
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

  // The primary color is the 'Tesla Blue' found on their website
  primary: 'rgb(62, 106, 225)',

  // Various text colours for light theme
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
