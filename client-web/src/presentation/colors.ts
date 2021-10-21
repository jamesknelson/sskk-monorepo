import { rgba } from 'polished'

/*
 * All exported colors should be taken from the palette. The palette is
 * also exported directly.
 */

export const paletteColors = {
  focusBlue: '#4488dd',

  ink900: '#102030',
  ink700: '#334455',
  ink500: '#606672',
  ink100: '#d8dbde',
  ink050: '#F4F8FF',

  secondary500: '#2a98c3',
}

// ---

export const structureColors = {
  bg: '#FFFFFF',
  canvas: '#F5F7F9',
  wash: '#F9FbFd',
  border: '#ECEEF5',
  divider: '#F6F7F8',
}

// Sub-objects contain variant colors, with `default` used unless the
// required variant is available. Individual colors can be either strings or
// high-style objects.
export const controlColors = {
  bg: {
    default: '#FBFCFF',
    highlight: rgba(paletteColors.focusBlue, 0.05),
    warning: '#FFFDFD',
    issue: '#F9F7F5',
  },
  border: {
    default: '#E0E8EC',
    warning: '#c7c0c0',
    issue: '#c7c0c0',
  },
  icon: {
    default: paletteColors.ink700,
    empty: '#C8CAD0',
    warning: '#D0C0C0',
    issue: '#D0C0C0',
  },
}

export const textColors = {
  default: '#282A2C',
  secondary: '#384048',
  tertiary: '#607080',
  subHeading: '#9098B0',
  placeholder: '#AABBCC',
  issue: '#4e3e3e',
  warning: '#4e3e3e',
  success: '#113322',
  link: '#102030',
  light: 'rgba(255, 255, 255, 0.93)',
}
