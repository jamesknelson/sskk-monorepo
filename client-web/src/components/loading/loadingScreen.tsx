import { css } from '@emotion/react'

import { colors } from 'src/theme'

import { LoadingSpinner } from './loadingSpinner'

export function LoadingScreen() {
  return (
    <div
      css={css`
        position: fixed;
        height: 4rem;
        width: 4rem;
        top: calc(50% - 2rem);
        left: calc(50% - 2rem);
        margin: 0 auto;
      `}>
      <LoadingSpinner
        backgroundColor={colors.structure.wash}
        color={colors.ink.light}
      />
    </div>
  )
}
