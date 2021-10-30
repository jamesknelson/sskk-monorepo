import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
  inDisabledSurface,
  inFocusedSurface,
  inHoveredSurface,
} from 'retil-interaction'

import { paletteColors } from './colors'
import { easeOut } from './easings'
import { interactionShadow } from './shadows'

export interface InteractionRingDivProps {
  inline?: boolean
}

export const InteractionRingDiv = styled.div(
  (props: InteractionRingDivProps) => [
    props.inline
      ? css`
          display: inline-flex;
        `
      : css`
          display: flex;
        `,
    css`
      flex-direction: column;
      flex-grow: 1;
      align-items: stretch;

      border-radius: 999px;

      transition: box-shadow 250ms ${easeOut};
    `,
    inHoveredSurface(css`
      box-shadow: ${interactionShadow(paletteColors.ink100)};
    `),
    inFocusedSurface(css`
      box-shadow: ${interactionShadow(paletteColors.focusBlue)} !important;
    `),
    inDisabledSurface(
      inHoveredSurface(css`
        box-shadow: ${interactionShadow(paletteColors.ink100, 0.5)};
      `),
    ),
  ],
)
