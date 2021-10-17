import { Boundary } from 'retil-boundary'
import { LoaderProps, loadLazy } from 'retil-mount'
import { loadMatch, loadNotFoundBoundary } from 'retil-nav'
import { AppEnv } from 'src/env'

import { patternFor } from 'src/utils/urls'

import Layout from './appLayout'
import urls from './appURLs'
import loadingLoader from './loadingLoader'
import notFoundLoader from './notFoundLoader'

const appLoader = (props: LoaderProps<AppEnv>) => (
  <Layout
    getTransitionKey={() =>
      props.mutablePersistedContext.transitionKey || props.nav.pathname
    }>
    <Boundary fallback={loadingLoader(props)}>
      {loadNotFoundBoundary(
        loadMatch<AppEnv>({
          '/': loadLazy(() => import('./front/frontLoader')),

          [patternFor(urls.editor)]: loadLazy(
            () => import('./editor/editorLoader'),
          ),

          [patternFor(urls.letter, { optional: ['letterSlug'] })]: loadLazy(
            () => import('./letter/letterLoader'),
          ),

          [patternFor(urls.login)]: loadLazy(
            () => import('./login/loginLoader'),
          ),
          [patternFor(urls.logout)]: loadLazy(() => import('./logoutLoader')),

          [patternFor(urls.join)]: loadLazy(() => import('./join/joinLoader')),

          [patternFor(urls.read)]: loadLazy(() => import('./read/readLoader')),

          [patternFor(urls.profile)]: loadLazy(
            () => import('./profile/profileLoader'),
          ),

          [patternFor(urls.policies)]: loadLazy(
            () => import('./policiesLoader'),
          ),

          [patternFor(urls.recoverAccount)]: loadLazy(
            () => import('./recoverAccountLoader'),
          ),

          [patternFor(urls.settings)]: loadLazy(
            () => import('./settings/settingsLoader'),
          ),
        }),
        notFoundLoader,
      )(props)}
    </Boundary>
  </Layout>
)

export default appLoader
