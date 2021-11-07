import { Global, css } from '@emotion/react'

import karma600Woff from './fonts/karma-v11-latin-ext_latin-600.woff?url'
import karma600Woff2 from './fonts/karma-v11-latin-ext_latin-600.woff2?url'

import karlaRegularWoff2 from './fonts/karla-v15-latin-ext_latin-regular.woff2?url'
import karlaRegularWoff from './fonts/karla-v15-latin-ext_latin-regular.woff?url'
import karla700Woff2 from './fonts/karla-v15-latin-ext_latin-700.woff2?url'
import karla700Woff from './fonts/karla-v15-latin-ext_latin-700.woff?url'
import karlaItalicWoff2 from './fonts/karla-v15-latin-ext_latin-italic.woff2?url'
import karlaItalicWoff from './fonts/karla-v15-latin-ext_latin-italic.woff?url'
import karla700ItalicWoff2 from './fonts/karla-v15-latin-ext_latin-700italic.woff2?url'
import karla700ItalicWoff from './fonts/karla-v15-latin-ext_latin-700italic.woff?url'

import chomskyWoff from './fonts/Chomsky.woff?url'
import chomskyWoff2 from './fonts/Chomsky.woff2?url'
// import bebasNeueWoff from './fonts/subset-BebasNeue-Regular.woff?url'
// import bebasNeueWoff2 from './fonts/subset-BebasNeue-Regular.woff2?url'

export const serifFontFamily = 'Karma, serif'
export const sansFontFamily = 'Karla, sans-serif'

export const fontPreloadLinks = [
  <link
    rel="preload"
    as="font"
    href={karlaRegularWoff2}
    type="font/woff2"
    crossOrigin="anonymous"
  />,
  <link
    rel="preload"
    as="font"
    href={karma600Woff2}
    type="font/woff2"
    crossOrigin="anonymous"
  />,
]

// This can be added to head on pages where the logo is important.
export const logoFontPreloadLinks = [
  <link
    rel="preload"
    as="font"
    href={chomskyWoff2}
    type="font/woff2"
    crossOrigin="anonymous"
  />,
]

export function FontFaces() {
  return (
    <Global
      styles={css`
        /* karma-600 - latin-ext_latin */
        @font-face {
          font-family: 'Karma';
          font-style: normal;
          font-weight: 600;
          src: local(''), url('${karma600Woff2}') format('woff2'),
            /* Chrome 26+, Opera 23+, Firefox 39+ */ url('${karma600Woff}')
              format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }

        /* karla-regular - latin-ext_latin */
        @font-face {
          font-family: 'Karla';
          font-style: normal;
          font-weight: 400;
          src: local(''), url('${karlaRegularWoff2}') format('woff2'),
            /* Chrome 26+, Opera 23+, Firefox 39+ */ url('${karlaRegularWoff}')
              format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
        /* karla-700 - latin-ext_latin */
        @font-face {
          font-family: 'Karla';
          font-style: normal;
          font-weight: 700;
          src: local(''), url('${karla700Woff2}') format('woff2'),
            /* Chrome 26+, Opera 23+, Firefox 39+ */ url('${karla700Woff}')
              format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
        /* karla-italic - latin-ext_latin */
        @font-face {
          font-family: 'Karla';
          font-style: italic;
          font-weight: 400;
          src: local(''), url('${karlaItalicWoff2}') format('woff2'),
            /* Chrome 26+, Opera 23+, Firefox 39+ */ url('${karlaItalicWoff}')
              format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
        /* karla-700italic - latin-ext_latin */
        @font-face {
          font-family: 'Karla';
          font-style: italic;
          font-weight: 700;
          src: local(''), url('${karla700ItalicWoff2}') format('woff2'),
            /* Chrome 26+, Opera 23+, Firefox 39+ */
              url('${karla700ItalicWoff}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }

        @font-face {
          font-family: 'Chomsky';
          src: url('${chomskyWoff2}') format('woff2'),
            url('${chomskyWoff}') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: block;
        }
      `}
    />
  )
}

/* @font-face {
  font-family: 'Bebas Neue';
  src: url('${bebasNeueWoff2}') format('woff2'),
    url('${bebasNeueWoff}') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
} */
