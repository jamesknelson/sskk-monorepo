/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />
/// <reference types="vite/client" />

import createStyleCache from '@emotion/cache'
import firebase from 'firebase/app'
import 'firebase/auth'
import { createRoot } from 'react-dom'

import { App } from './app'
import { firebase as firebaseConfig, firebaseEmulators } from './config'
import { appPageSerializedDataGlobal } from './constants/htmlGeneration'
import { createBrowserAppEnvSource } from './env/browserAppEnv'
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
const envSource = createBrowserAppEnvSource(
  (window as any)[appPageSerializedDataGlobal],
)

reactRoot.render(
  <App env={envSource} loader={appLoader} styleCache={styleCache} />,
)
