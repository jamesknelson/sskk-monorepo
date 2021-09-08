import { loadLazy } from 'retil-mount'
import { loadMatch, loadNotFoundBoundary, loadRedirect } from 'retil-nav'
import { AppEnv } from 'src/env'

import { patternFor } from 'src/utils/urls'

import urls from './appURLs'
import notFoundLoader from './notFoundLoader'

const appLoader = loadNotFoundBoundary(
  loadMatch<AppEnv>({
    './': loadRedirect(patternFor(urls.hello)),

    [patternFor(urls.editor)]: loadLazy(() => import('./editor/editorLoader')),

    [patternFor(urls.hello)]: loadLazy(() => import('./hello/helloLoader')),

    [patternFor(urls.letter, { optional: ['letterSlug'] })]: loadLazy(
      () => import('./letter/letterLoader'),
    ),

    [patternFor(urls.login)]: loadLazy(() => import('./loginLoader')),
    [patternFor(urls.logout)]: loadLazy(() => import('./logoutLoader')),

    [patternFor(urls.onboarding)]: loadLazy(
      () => import('./onboarding/onboardingLoader'),
    ),

    [patternFor(urls.read)]: loadLazy(() => import('./read/readLoader')),

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
