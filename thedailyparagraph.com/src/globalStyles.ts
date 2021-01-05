import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

	/* These styles make the body full-height */
  html {
    font-size: 16px;
		min-height: 100%;
    height: 100%;
  }

  body {
    background-color: transparent;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    font-size: 1rem;
    line-height: 1.5rem;
    height: 100%;
    min-height: 100%;
  }

  #__next {
    min-height: 100%;
    display: flex;
    flex-grow: 1;
  }

  .ps__rail-x,
  .ps__rail-y {
    z-index: 999;
  }
`
