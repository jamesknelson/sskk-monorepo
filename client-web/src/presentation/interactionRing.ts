import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { inFocusedSurface, inHoveredSurface } from 'retil-interaction'

import { paletteColors } from 'src/presentation/colors'
import { easeOut } from 'src/presentation/easings'
import { interactionShadow } from 'src/presentation/shadows'

export const InteractionRingDiv = styled.div([
  css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-content: stretch;

    border-radius: 999px;

    transition: box-shadow 250ms ${easeOut};
  `,
  inHoveredSurface(css`
    box-shadow: ${interactionShadow(paletteColors.ink100)};
  `),
  inFocusedSurface(css`
    box-shadow: ${interactionShadow(paletteColors.focusBlue)};
  `),
])
