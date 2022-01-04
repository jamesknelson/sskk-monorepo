import {
  CacheProvider as StyleCacheProvider,
  EmotionCache,
  ThemeContext,
  ThemeProvider,
  css,
} from '@emotion/react'
import { ReactNode } from 'react'
import { CSSProvider } from 'retil-css'
import { Boundary } from 'retil-boundary'
import { useBoundaryHydrater } from 'retil-hydration'
import {
  CastableToEnvSource,
  Loader,
  Mount,
  useMountContent,
} from 'retil-mount'
import { useBoundaryNavScroller } from 'retil-nav'

import { AppEnv } from './appEnv'
import { Head, HeadContext } from './head'

import { FontFaces } from 'lib-ui-web/style/fonts'
import { GlobalStyles } from 'lib-ui-web/style/globalStyles'
import { theme as lightTheme } from 'lib-ui-web/theme/lightTheme'
import { smoothScrollTo } from 'lib-ui-web/util/smoothScrollTo'
import { AppLayout } from './components/layout'

export interface AppProps {
  env: CastableToEnvSource<AppEnv>
  headContext?: HeadContext
  loader: Loader<AppEnv>
  styleCache: EmotionCache
}

export function App(props: AppProps) {
  return (
    <StyleCacheProvider value={props.styleCache}>
      <ThemeProvider theme={lightTheme}>
        <CSSProvider runtime={css} themeContext={ThemeContext}>
          <FontFaces />
          <GlobalStyles />
          <Mount loader={props.loader} env={props.env}>
            <Head context={props.headContext} />
            <AppLayout>
              <Boundary fallback="loading">
                <InnerApp />
              </Boundary>
            </AppLayout>
          </Mount>
        </CSSProvider>
      </ThemeProvider>
    </StyleCacheProvider>
  )
}

function InnerApp() {
  const content = useMountContent<ReactNode>()

  useBoundaryHydrater()
  useBoundaryNavScroller({
    scrollTo: smoothScrollTo,
  })

  return <>{content}</>
}
