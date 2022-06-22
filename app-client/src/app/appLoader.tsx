import { Boundary } from 'retil-boundary'
import { LoaderProps, loadLazy } from 'retil-mount'
import { loadMatch, loadNotFoundBoundary } from 'retil-nav'
import { patternFor } from 'retil-nav-scheme'
import { useSource } from 'retil-source'

import {
  Layout,
  LayoutLoadingSpinner,
  LayoutProps,
} from 'lib-ui-web/component/layout'

import { Env, useEnv } from '~/env'
import { authBarHiddenSource } from '~/service/authBarService'

import scheme from './appScheme'
import notFoundLoader from './notFoundLoader'

export interface AppLayoutProps extends Omit<LayoutProps, 'transitionKey'> {
  getTransitionKey: () => string
}

// We can't evaluate `getTransitionKey` inside the loader, as running child
// loaders may cause the result to update. Instead, we'll evaluate it within
// the React component, as at this point all loaders will have completed.
const AppLayout = ({
  getTransitionKey,
  ...rest
}: Omit<AppLayoutProps, 'showAuthFooter'>) => {
  const env = useEnv()
  const forceAuthBarHidden = useSource(authBarHiddenSource)
  const authBarHidden = env.customerIdentity !== null || forceAuthBarHidden

  return (
    <Layout
      showAuthFooter={!authBarHidden}
      transitionKey={getTransitionKey()}
      {...rest}
    />
  )
}

const appLoader = (props: LoaderProps<Env>) => (
  <AppLayout
    getTransitionKey={() =>
      props.mutablePersistedContext.appLayoutTransitionKey || props.nav.pathname
    }
    scheme={scheme}>
    <Boundary fallback={<LayoutLoadingSpinner />}>
      {loadNotFoundBoundary(
        loadMatch<Env>({
          '/': loadLazy(() => import('./front/frontLoader')),

          // [patternFor(scheme.editor)]: loadLazy(
          //   () => import('./editor/editorLoader'),
          // ),

          // [patternFor(scheme.letter, { optional: ['letterSlug'] })]: loadLazy(
          //   () => import('./letter/letterLoader'),
          // ),

          [patternFor(scheme.login)]: loadLazy(
            () => import('./login/loginLoader'),
          ),
          [patternFor(scheme.logout)]: loadLazy(() => import('./logoutLoader')),

          [patternFor(scheme.join)]: loadLazy(
            () => import('./join/joinLoader'),
          ),

          [patternFor(scheme.read)]: loadLazy(
            () => import('./read/readLoader'),
          ),

          // [patternFor(scheme.profile)]: loadLazy(
          //   () => import('./profile/profileLoader'),
          // ),

          [patternFor(scheme.policies)]: loadLazy(
            () => import('./policiesLoader'),
          ),

          [patternFor(scheme.recoverAccount)]: loadLazy(
            () => import('./recoverAccountLoader'),
          ),

          // [patternFor(scheme.settings)]: loadLazy(
          //   () => import('./settings/settingsLoader'),
          // ),
        }),
        notFoundLoader,
      )(props)}
    </Boundary>
  </AppLayout>
)

export default appLoader
