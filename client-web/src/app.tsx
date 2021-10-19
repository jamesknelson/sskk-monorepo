import { ApolloProvider } from '@apollo/client'
import {
  CacheProvider as StyleCacheProvider,
  EmotionCache,
  ThemeContext,
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

import { AppEnv, AuthProvider, useAppEnv } from './env'
import { Head, HeadContext } from './head'
import { FontFaces } from './assets/fonts'
import { GlobalStyles } from './presentation/globalStyles'
import { smoothScrollTo } from './utils/smoothScrollTo'

export interface AppProps {
  env: CastableToEnvSource<AppEnv>
  headContext?: HeadContext
  loader: Loader<AppEnv>
  styleCache: EmotionCache
}

export function App(props: AppProps) {
  return (
    <StyleCacheProvider value={props.styleCache}>
      <CSSProvider runtime={css} themeContext={ThemeContext}>
        <FontFaces />
        <GlobalStyles />
        <Mount loader={props.loader} env={props.env}>
          <Head context={props.headContext} />
          <AuthProvider>
            <InnerApp />
          </AuthProvider>
        </Mount>
      </CSSProvider>
    </StyleCacheProvider>
  )
}

function InnerApp() {
  const env = useAppEnv()
  const content = useMountContent<ReactNode>()

  useBoundaryHydrater()
  useBoundaryNavScroller({
    scrollTo: smoothScrollTo,
  })

  return <ApolloProvider client={env.client}>{content}</ApolloProvider>
}
