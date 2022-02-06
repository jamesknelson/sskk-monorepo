import prosemirrorStyles from 'prosemirror-view/style/prosemirror.css'

import {
  CacheProvider as StyleCacheProvider,
  EmotionCache,
  Global,
  ThemeContext,
  ThemeProvider,
  css,
} from '@emotion/react'
import { ReactNode } from 'react'
import { CSSProvider } from 'retil-css'
import { Boundary } from 'retil-boundary'
import { useBoundaryHydrater } from 'retil-hydration'
import { CastableToEnvSource, Mount, useMountContent } from 'retil-mount'
import { useBoundaryNavScroller } from 'retil-nav'

import { FontFaces } from 'lib-ui-web/style/fonts'
import { GlobalStyles } from 'lib-ui-web/style/globalStyles'
import { GlobalStylesInDevMode } from 'lib-ui-web/style/globalStylesInDevMode'
import { theme as lightTheme } from 'lib-ui-web/theme/lightTheme'
import { smoothScrollTo } from 'lib-ui-web/util/smoothScrollTo'

import { Layout } from '~/component/layout'
import { Env } from '~/env'
import { Head, HeadSink } from '~/head'

import appLoader from './appLoader'

export interface AppProps {
  env: CastableToEnvSource<Env>
  headSink?: HeadSink
  styleCache: EmotionCache
}

export function App(props: AppProps) {
  return (
    <StyleCacheProvider value={props.styleCache}>
      <ThemeProvider theme={lightTheme}>
        <CSSProvider runtime={css} themeContext={ThemeContext}>
          <AppGlobalStyles />
          <Mount loader={appLoader} env={props.env}>
            <Head sink={props.headSink} />
            <Layout>
              <Boundary fallback="loading">
                <InnerApp />
              </Boundary>
            </Layout>
          </Mount>
        </CSSProvider>
      </ThemeProvider>
    </StyleCacheProvider>
  )
}

function AppGlobalStyles() {
  return (
    <>
      {import.meta.env.DEV && <GlobalStylesInDevMode />}
      <GlobalStyles />
      <FontFaces />
      <Global styles={prosemirrorStyles} />
    </>
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
