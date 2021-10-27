import { rgba } from 'polished'

import { structureColors } from './colors'

export const cardShadow = ({ color }: { color?: string } = {}) =>
  [
    `0 0 2px 0px ${rgba(color || structureColors.border, 0.75)}`,
    `0 0 10px ${rgba(color || structureColors.border, 0.75)}`,
    `0 0 10px ${rgba(color || structureColors.border, 0.33)} inset`,
  ].join(', ')

export const interactionShadow = (color: string, opacity = 1) =>
  `0 0 0 2px ${rgba(color, opacity)}, 0 0 4px 3px ${rgba(color, 0.4 * opacity)}`

export const raisedCardShadow = () => `0 0 6px 1px ${rgba(0, 0, 0, 0.05)},
    0 0 8px 1px ${rgba(0, 0, 0, 0.02)};`

export const sectionShadow = (color = structureColors.wash) =>
  `0 0 15px 1px ${rgba(color, 0.88)},
  0 0 10px 2px ${rgba(color, 0.44)} inset`

export const inkShadow = (
  color: string,
  { external }: { external?: boolean } = {},
) =>
  `0 0 0 1px ${color} ${external ? '' : 'inset'},
  0 0 10px ${rgba(color, 0.12)},
  0 0 10px ${rgba(color, 0.12)} inset`
