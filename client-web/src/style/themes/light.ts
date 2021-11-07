import { rgba } from 'polished'

import { Theme } from 'src/types'

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

const error = '#f50057'

//
// Palette
//

const neutralPalette = {}
const neutralAltPalette = {}

const primaryPalette = {}
const secondaryPalette = {}
const tertiaryPalette = {}

const errorPalette = {}

//
// Scheme
//

const colorScheme = {
  background: neutral99,
  onBackground: neutral10,

  primary,
  onPrimary,
  primaryWash,
  onPrimaryWash,

  secondary,
  onSecondary,
  secondaryWash,
  onSecondaryWash,

  error,
  onError,
  errorWash,
  onErrorWash,

  surface: white,
  surfaceBorder, // Between surface and backgorund
  surfaceLine, // As divider, between surface and wash, or as outline
  onSurface,
  surfaceWash,
  onSurfaceWash,

  // Surface shaded darker w/ primary
  altSurface,
  altSurfaceBorder,
  altSurfaceLine,
  onAltSurface,
  altSurfaceWash,
  onAltSurfaceWash,

  inverseSurface,
  inverseSurfaceLine,
  inverseSurfaceOutline,
  onInverseSurface,

  // For use on inverse surface
  inversePrimary,
}

// Used for dimming `on` colors
const opacityScheme = {
  dim: 60,
  placeholder: 38,
}
