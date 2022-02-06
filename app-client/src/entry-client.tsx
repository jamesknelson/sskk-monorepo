/// <reference types="react/next" />
/// <reference types="react-dom/next" />
/// <reference types="vite/client" />

import createStyleCache from '@emotion/cache'
import { createRoot } from 'react-dom'

import { App } from './app/app'

import { appPageSerializedDataGlobal } from './config'
import { createBrowserAppEnvSource } from './env/browserAppEnv'
import appLoader from './app/appLoader'

const styleCache = createStyleCache({ key: 'sskk' })
const rootNode = document.getElementById('root')!
const reactRoot = createRoot(rootNode, { hydrate: true })
const envSource = createBrowserAppEnvSource(
  (window as any)[appPageSerializedDataGlobal],
)

reactRoot.render(
  <App env={envSource} loader={appLoader} styleCache={styleCache} />,
)
