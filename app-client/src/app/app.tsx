import prosemirrorStyles from 'prosemirror-view/style/prosemirror.css'

import { ApolloProvider } from '@apollo/client'
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
import { useBoundaryHydrater } from 'retil-hydration'
import {
  CastableToEnvSource,
  Loader,
  Mount,
  useMountContent,
} from 'retil-mount'
import { useBoundaryNavScroller } from 'retil-nav'

import { FontFaces } from 'lib-ui-web/style/fonts'
import { GlobalStyles } from 'lib-ui-web/style/globalStyles'
import { GlobalStylesInDevMode } from 'lib-ui-web/style/globalStylesInDevMode'
import { theme as lightTheme } from 'lib-ui-web/theme/lightTheme'
import { smoothScrollTo } from 'lib-ui-web/util/smoothScrollTo'

import { Env, AuthProvider, useEnv } from '~/env'
import { Head, HeadContext } from '~/head'

export interface AppProps {
  env: CastableToEnvSource<Env>
  headContext?: HeadContext
  loader: Loader<Env>
  styleCache: EmotionCache
}

export function App(props: AppProps) {
  return (
    <StyleCacheProvider value={props.styleCache}>
      <ThemeProvider theme={lightTheme}>
        <CSSProvider runtime={css} themeContext={ThemeContext}>
          <AppGlobalStyles />
          <Mount loader={props.loader} env={props.env}>
            <Head context={props.headContext} />
            <AuthProvider>
              <InnerApp />
            </AuthProvider>
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
  const env = useEnv()
  const content = useMountContent<ReactNode>()

  useBoundaryHydrater()
  useBoundaryNavScroller({
    scrollTo: smoothScrollTo,
  })

  return <ApolloProvider client={env.client}>{content}</ApolloProvider>
}
