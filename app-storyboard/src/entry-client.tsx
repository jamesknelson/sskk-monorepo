/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />
/// <reference types="vite/client" />

import createStyleCache from '@emotion/cache'
import { hydrateRoot } from 'react-dom'
import { getDefaultHydrationEnvService } from 'retil-hydration'
import { getDefaultBrowserNavEnvService } from 'retil-nav'
import { fuse } from 'retil-source'

import { App } from './app'
import appLoader from './appLoader'

const styleCache = createStyleCache({ key: 'sskk' })
const rootNode = document.getElementById('root')!
const [hydrationEnvSource] = getDefaultHydrationEnvService()
const [navEnvSource] = getDefaultBrowserNavEnvService()

const envSource = fuse((use) => {
  const hydrationEnv = use(hydrationEnvSource)
  const navEnv = use(navEnvSource)

  return {
    ...hydrationEnv,
    ...navEnv,
    head: [],
  }
})

hydrateRoot(
  rootNode,
  <App env={envSource} loader={appLoader} styleCache={styleCache} />,
)
