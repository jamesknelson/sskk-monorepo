import { rgba } from 'polished'

import { ColorScheme, OpacityScheme, Theme } from 'src/types'

// const primary = '#334455'
// const primaryDark = '#0a1d2c'
// const primaryLight = '#5e6f82'

// const primaryPalette = {
//   10: '#212F3D',
//   20: '#334455',
//   95: '#F5F7F9',
//   99: '#F9FbFd',
// }

// const secondary = '#0009ca'
// const secondaryDark = '#000086'
// const secondaryLight = '#304ffe'

// const secondaryPalette = {}

// const error = '#f50057'
// const errorDark = '#bb002f'
// const errorLight = '#ff616f'

//
// Key colors
//

const white = '#ffffff'
const black = '#000000'

const neutral = '#101820'
const neutralAlt = '#202224'

const primary = '#102030'
const secondary = '#0009ca'
const tertiary = '' // use tertiary for focus indicators, maybe teal?

const issue = '#f50057'

const placeholder = 'pink'

//
// Palette
//

const neutralPalette = {
  10: placeholder,
  20: placeholder,
  30: placeholder,
  40: placeholder,
  50: placeholder,
  60: placeholder,
  70: placeholder,
  80: placeholder,
  90: placeholder,
  95: placeholder,
  99: placeholder,
}
const neutralAltPalette = {
  10: placeholder,
  20: placeholder,
  30: placeholder,
  40: placeholder,
  50: placeholder,
  60: placeholder,
  70: placeholder,
  80: placeholder,
  90: placeholder,
  95: placeholder,
  99: placeholder,
}

const primaryPalette = {
  10: placeholder,
  20: placeholder,
  30: placeholder,
  40: placeholder,
  50: placeholder,
  60: placeholder,
  70: placeholder,
  80: placeholder,
  90: placeholder,
  95: placeholder,
  99: placeholder,
}
const secondaryPalette = {
  10: placeholder,
  20: placeholder,
  30: placeholder,
  40: placeholder,
  50: placeholder,
  60: placeholder,
  70: placeholder,
  80: placeholder,
  90: placeholder,
  95: placeholder,
  99: placeholder,
}
const tertiaryPalette = {
  10: placeholder,
  20: placeholder,
  30: placeholder,
  40: placeholder,
  50: placeholder,
  60: placeholder,
  70: placeholder,
  80: placeholder,
  90: placeholder,
  95: placeholder,
  99: placeholder,
}

const errorPalette = {
  10: placeholder,
  20: placeholder,
  30: placeholder,
  40: placeholder,
  50: placeholder,
  60: placeholder,
  70: placeholder,
  80: placeholder,
  90: placeholder,
  95: placeholder,
  99: placeholder,
}

//
// Scheme
//

export const colorScheme: ColorScheme = {
  background: neutral[99],
  onBackground: neutral[10],

  primary: primary[90],
  onPrimary: primary[10],
  primaryWash: primary[60],
  onPrimaryWash: primary[20],

  secondary: placeholder,
  onSecondary: placeholder,
  secondaryWash: placeholder,
  onSecondaryWash: placeholder,

  tertiary: placeholder,
  onTertiary: placeholder,
  tertiaryWash: placeholder,
  onTertiaryWash: placeholder,

  issue: placeholder,
  onIssue: placeholder,
  issueWash: placeholder,
  onIssueWash: placeholder,

  surface: white,
  surfaceBorder: placeholder, // Between surface and backgorund
  surfaceLine: placeholder, // As divider, between surface and wash, or as outline
  onSurface: placeholder,
  surfaceWash: placeholder,
  onSurfaceWash: placeholder,

  // Surface shaded darker w/ primary
  altSurface: placeholder,
  altSurfaceBorder: placeholder,
  altSurfaceLine: placeholder,
  onAltSurface: placeholder,
  altSurfaceWash: placeholder,
  onAltSurfaceWash: placeholder,

  inverseSurface: placeholder,
  inverseSurfaceBorder: placeholder,
  inverseSurfaceLine: placeholder,
  onInverseSurface: placeholder,

  // For use on inverse surface
  inversePrimary: placeholder,
}

// Used for dimming `on` colors
export const opacityScheme: OpacityScheme = {
  alt: 83,
  peripheral: 60,
  placeholder: 38,
}

export const theme: Theme = {
  color: colorScheme,
  opacity: opacityScheme,
}
