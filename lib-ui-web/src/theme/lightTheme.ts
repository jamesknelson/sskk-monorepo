// https://coolors.co/607080-101618-1b1f4b-304ffe-ff5722-d50000

import { ColorScheme, OpacityScheme, Theme } from './theme'

export const neutral = {
  0: '#000000',
  10: '#0c0e10',
  20: '#242a31',
  30: '#3d4751',
  40: '#556371',
  50: '#6d7f92',
  60: '#8e9caa',
  70: '#aeb8c2',
  80: '#ced4db',
  90: '#eff1f3',
  95: '#f7f8f9',
  99: '#FBFcFf',
  100: '#ffffff',
}
export const neutralAlt = {
  0: '#000000',
  10: '#0d0e0f',
  20: '#282a2d',
  30: '#43474b',
  40: '#5d6369',
  50: '#788087',
  60: '#969ca2',
  70: '#b4b8bc',
  80: '#d2d4d7',
  90: '#f0f1f2',
  95: '#f7f9fa',
  99: '#FaFcFf',
  100: '#ffffff',
}
export const primary = {
  0: '#000000',
  10: '#03070a',
  20: '#102030',
  30: '#1e3c5b',
  40: '#2c5783',
  50: '#548dc6',
  60: '#7ca8d3',
  70: '#a4c3e1',
  80: '#caddf0',
  90: '#e0eaf6',
  95: '#f2f6fd',
  99: '#FaFbFF',
  100: '#ffffff',
}
export const secondary = {
  0: '#000000',
  10: '#000628',
  20: '#000e5d',
  30: '#011378',
  40: '#0123e3',
  50: '#304ffe',
  60: '#516bfe',
  70: '#6c82fe',
  80: '#a1afff',
  90: '#d7ddff',
  95: '#f2f4ff',
  99: '#f8fbff',
  100: '#ffffff',
}
export const tertiary = {
  0: '#000000',
  10: '#0d0300',
  20: '#280a00',
  30: '#5e1700',
  40: '#c93000',
  50: '#ff3d00',
  60: '#ff521b',
  70: '#ff8f6b',
  80: '#ffb8a1',
  90: '#ffe0d7',
  95: '#fff5f2',
  99: '#fffcf9',
  100: '#ffffff',
}
export const issue = {
  0: '#000000',
  10: '#0d0000',
  20: '#430000',
  30: '#790000',
  40: '#ae0000',
  50: '#D50000',
  60: '#ff3636',
  70: '#ff6b6b',
  80: '#ffa1a1',
  90: '#ffd7d7',
  95: '#fff2f2',
  99: '#fffafa',
  100: '#ffffff',
}

//
// Scheme
//

const colorScheme: ColorScheme = {
  background: neutral[99],
  onBackground: neutral[10],

  primary: primary[30],
  onPrimary: primary[10],
  primaryWash: primary[95],
  onPrimaryWash: primary[10],

  secondary: secondary[40],
  onSecondary: secondary[95],
  secondaryWash: secondary[90],
  onSecondaryWash: secondary[10],

  tertiary: tertiary[50],
  onTertiary: tertiary[100],
  tertiaryWash: tertiary[90],
  onTertiaryWash: tertiary[20],

  issue: issue[40],
  onIssue: issue[95],
  issueWash: issue[80],
  onIssueWash: issue[20],

  surface: neutral[100],
  surfaceBorder: neutral[90],
  surfaceLine: neutral[95],
  onSurface: neutral[10],

  // Surface shaded darker w/ primary
  altSurface: neutralAlt[90],
  altSurfaceBorder: neutralAlt[90],
  altSurfaceLine: neutralAlt[90],
  onAltSurface: neutralAlt[40],

  inverseSurface: neutral[10],
  inverseSurfaceBorder: neutral[30],
  inverseSurfaceLine: neutral[20],
  onInverseSurface: neutral[90],

  // For use on inverse surface
  inversePrimary: primary[40],
}

// Used for dimming `on` colors
const opacityScheme: OpacityScheme = {
  alt: 0.83,
  peripheral: 0.6,
  placeholder: 0.38,
}

export const palette = {
  neutral,
  neutralAlt,
  primary,
  secondary,
  tertiary,
  issue,
}

export const theme: Theme = {
  color: colorScheme,
  opacity: opacityScheme,
}
