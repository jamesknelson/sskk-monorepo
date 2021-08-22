import { loadLazy } from 'retil-mount'
import { loadMatch, loadNotFoundBoundary } from 'retil-nav'
import { AppEnv } from 'src/env'

import { patternFor } from 'src/utils/urls'

import urls from './appURLs'
import notFoundLoader from './notFoundLoader'

const appLoader = loadNotFoundBoundary(
  loadMatch<AppEnv>({
    [patternFor(urls.editor)]: loadLazy(() => import('./editor/editorLoader')),

    [patternFor(urls.hello)]: loadLazy(() => import('./hello/helloLoader')),

    [patternFor(urls.join)]: loadLazy(() => import('./join/joinLoader')),

    [patternFor(urls.letter, { optional: ['letterSlug'] })]: loadLazy(
      () => import('./letter/letterLoader'),
    ),

    [patternFor(urls.login)]: loadLazy(() => import('./loginLoader')),
    [patternFor(urls.logout)]: loadLazy(() => import('./logoutLoader')),

    [patternFor(urls.profile)]: loadLazy(
      () => import('./profile/profileLoader'),
    ),

    [patternFor(urls.policies)]: loadLazy(() => import('./policiesLoader')),

    [patternFor(urls.recoverAccount)]: loadLazy(
      () => import('./recoverAccountLoader'),
    ),

    [patternFor(urls.settings)]: loadLazy(
      () => import('./settings/settingsLoader'),
    ),
  }),
  notFoundLoader,
)

export default appLoader
