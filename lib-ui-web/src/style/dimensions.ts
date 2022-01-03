import { media } from 'retil-media'

export const defaultMaxFieldWidth = '28rem'

export const largeColumnClampWidth = '48rem'

export const remPixels = 16

// Specified in pixels for compatability with IntersectionObserver
export const barHeightPixels = remPixels * 3
export const barHeight = barHeightPixels + 'px'
export const barWidth = '4rem'

export const smallColumnClampWidth = '22rem'

// The amount of space between a page edge and standard text content.
export const blockMarginHorizontal = {
  [media.small]: '1rem',
  [media.atLeastMedium]: '2rem',
}
