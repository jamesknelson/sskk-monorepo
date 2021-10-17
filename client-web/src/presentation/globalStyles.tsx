import { Global, css } from '@emotion/react'
import prosemirrorStyles from 'prosemirror-view/style/prosemirror.css'

import { structureColors } from './colors'
import { remPixels } from './dimensions'

export const GlobalStyles = () => {
  const devStyles = import.meta.env.DEV && (
    <Global
      styles={css`
        .firebase-emulator-warning {
          display: none !important;
        }
      `}
    />
  )

  return (
    <>
      {devStyles}
      <Global
        styles={css`
          * {
            appearance: none;
            border: 0;
            box-sizing: inherit;
            -webkit-font-smoothing: auto;
            font-weight: inherit;
            margin: 0;
            outline: 0;
            padding: 0;
            text-decoration: none;
            text-rendering: optimizeLegibility;
            -webkit-appearance: none;
            -moz-appearance: none;
          }

          /* These styles make the body full-height */
          html {
            background-color: ${structureColors.wash};
            box-sizing: border-box;
            font-family: Lora, -apple-system, BlinkMacSystemFont, 'Segoe UI',
              Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
              'Helvetica Neue', sans-serif;
            font-size: ${remPixels}px;
            height: 100%;
            line-height: 1.5rem;
            min-height: 100%;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          body,
          #root {
            height: 100%;
            min-height: 100%;
          }

          #root {
            display: flex;
            flex-grow: 1;
          }

          .ps__rail-x,
          .ps__rail-y {
            z-index: 999;
          }

          ${prosemirrorStyles}
        `}
      />
    </>
  )
}
