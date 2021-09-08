/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />
/// <reference types="vite/client" />

import createStyleCache from '@emotion/cache'
import {
  CacheProvider as StyleCacheProvider,
  ThemeContext,
  css,
} from '@emotion/react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { cloneElement } from 'react'
import { createRoot } from 'react-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Mount } from 'retil-mount'
import { CSSProvider } from 'retil-css'

import { App } from './components/app'
import { firebase as firebaseConfig, firebaseEmulators } from 'src/config'
import { retilDataCacheName } from './constants/htmlGeneration'
import { useAppEnv } from './env/appEnv'
import { createBrowserAppEnvSource } from './env/browserAppEnv'
import { AppGlobalStyles } from './styles/appGlobalStyles'
import appLoader from './pages/appLoader'

if (typeof window !== 'undefined') {
  firebase.initializeApp(firebaseConfig)

  const auth = firebase.auth()
  if (firebaseEmulators.auth) {
    auth.useEmulator(firebaseEmulators.auth)
  }
}

const styleCache = createStyleCache({ key: 'sskk' })
const rootNode = document.getElementById('root')!
const reactRoot = createRoot(rootNode, { hydrate: true })
const envSource = createBrowserAppEnvSource((window as any)[retilDataCacheName])

function Head() {
  const env = useAppEnv()
  return env.hydrating ? null : (
    <HelmetProvider>
      <Helmet>
        <title>The Daily Paragraph</title>
        {env.head.map((item, i) => cloneElement(item, { key: i }))}
      </Helmet>
    </HelmetProvider>
  )
}

reactRoot.render(
  <StyleCacheProvider value={styleCache}>
    <CSSProvider runtime={css} themeContext={ThemeContext}>
      <AppGlobalStyles />
      <Mount loader={appLoader} env={envSource}>
        <Head />
        <App />
      </Mount>
    </CSSProvider>
  </StyleCacheProvider>,
)
