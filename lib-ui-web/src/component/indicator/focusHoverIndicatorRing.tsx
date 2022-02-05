import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
  inDisabledSurface,
  inFocusedSurface,
  inHoveredSurface,
} from 'retil-interaction'

import { easeOut } from '~/style/easings'
import { interactionShadow } from '~/style/shadows'

export interface FocusHoverIndicatorRingProps {
  inline?: boolean
}

export const FocusHoverIndicatorRing = styled.div<FocusHoverIndicatorRingProps>(
  ({ inline, theme }) => [
    inline
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

      transition: box-shadow 150ms ${easeOut};
    `,
    inHoveredSurface(
      css`
        box-shadow: ${interactionShadow(theme.color.tertiary)};
      `,
      inDisabledSurface(css`
        box-shadow: ${interactionShadow(theme.color.secondary, 0.5)};
      `),
    ),
    inFocusedSurface(
      css`
        box-shadow: ${interactionShadow(theme.color.tertiary)} !important;
      `,
    ),
  ],
)
