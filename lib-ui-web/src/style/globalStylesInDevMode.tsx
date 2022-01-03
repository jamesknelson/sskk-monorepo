import { Global, css } from '@emotion/react'

export const GlobalStylesInDevMode = () => (
  <Global
    styles={css`
      .firebase-emulator-warning {
        display: none !important;
      }
    `}
  />
)
