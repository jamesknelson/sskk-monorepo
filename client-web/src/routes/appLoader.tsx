import { Boundary } from 'retil-boundary'
import { LoaderProps, loadLazy } from 'retil-mount'
import { loadMatch, loadNotFoundBoundary } from 'retil-nav'
import { AppEnv } from 'src/env'
import { FixedCenteredLoadingSpinner } from 'src/presentation/fixedCenteredLoadingSpinner'

import { patternFor } from 'src/utils/urls'

import Layout, { AppLayoutProps as LayoutProps } from './appLayout'
import urls from './appURLs'
import notFoundLoader from './notFoundLoader'

export interface AppLayoutProps extends Omit<LayoutProps, 'transitionKey'> {
  getTransitionKey: () => string
}

// We can't evaluate `getTransitionKey` inside the loader, as running child
// loaders may cause the result to update. Instead, we'll evaluate it within
// the React component, as at this point all loaders will have completed.
const AppLayout = ({ getTransitionKey, ...rest }: AppLayoutProps) => (
  <Layout transitionKey={getTransitionKey()} {...rest} />
)

const appLoader = (props: LoaderProps<AppEnv>) => (
  <AppLayout
    getTransitionKey={() =>
      props.mutablePersistedContext.transitionKey || props.nav.pathname
    }>
    <Boundary fallback={<FixedCenteredLoadingSpinner />}>
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
  </AppLayout>
)

export default appLoader
