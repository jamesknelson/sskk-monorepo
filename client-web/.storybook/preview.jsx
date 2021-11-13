import createStyleCache from '@emotion/cache'
import {
  CacheProvider as StyleCacheProvider,
  ThemeContext,
  css,
} from '@emotion/react'
import { CSSProvider } from 'retil-css'
import { useBoundaryHydrater } from 'retil-hydration'

import { FontFaces } from '../src/style/fonts'
import { GlobalStyles } from '../src/style/globalStyles'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <App>
      <Story />
    </App>
  ),
]

const styleCache = createStyleCache({ key: 'sskk' })

const App = ({ children }) => {
  useBoundaryHydrater()

  return (
    <StyleCacheProvider value={styleCache}>
      <CSSProvider runtime={css} themeContext={ThemeContext}>
        <FontFaces />
        <GlobalStyles />
        {children}
      </CSSProvider>
    </StyleCacheProvider>
  )
}
