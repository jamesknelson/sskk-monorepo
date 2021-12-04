import { Global, css } from '@emotion/react'

const GlobalStylesInDevMode = () => (
  <Global
    styles={css`
      .firebase-emulator-warning {
        display: none !important;
      }
    `}
  />
)

export default GlobalStylesInDevMode
