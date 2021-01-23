import { createGlobalStyle } from 'styled-components'

import { colors, dimensions } from 'src/theme'

// import emojiMartCSS from '!raw-loader!emoji-mart/css/emoji-mart.css'

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'chomskyregular';
    src: url('/fonts/chomsky-webfont.woff2') format('woff2'),
         url('/fonts/chomsky-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

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
    background-color: ${colors.structure.wash};
    box-sizing: border-box;
    font-family: Lora, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    font-size: ${dimensions.base};
    height: 100%;
    line-height: 1.5rem;
    min-height: 100%;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body, #__next {
    height: 100%;
    min-height: 100%;
  }

  #__next {
    display: flex;
    flex-grow: 1;
  }

  .ps__rail-x,
  .ps__rail-y {
    z-index: 999;
  }
`
