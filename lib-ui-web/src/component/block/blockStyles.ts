import { css } from '@emotion/react'
import { highStyle } from 'retil-css'

import { blockMarginHorizontal } from '~/style/dimensions'

export const blockHorizontalGutter = highStyle({
  marginLeft: blockMarginHorizontal,
  marginRight: blockMarginHorizontal,
})

export const blockVerticalGutter = css`
  margin-top: 1rem;
  margin-bottom: 1rem;
`

export const blockLargeVerticalGutter = css`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
