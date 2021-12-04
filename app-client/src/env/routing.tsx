import { Loader } from 'retil-mount'
import { NavAction, createHref, loadRedirect, NavEnv } from 'retil-nav'

import { LoadingPage } from 'src/routes/loadingPage'

import { AppEnv, AppMutablePersistedContext } from './appEnv'

export type AppLoader = Loader<AppEnv>

const loadingRouter = () => <LoadingPage />

export function switchAuth(routers: {
  authenticated: AppLoader
  pending: AppLoader
  unauthenticated: AppLoader
}): AppLoader {
  return (request) => {
    return (
      request.customer === undefined
        ? routers.pending
        : request.authUser
        ? routers.authenticated
        : routers.unauthenticated
    )(request)
  }
}

export function loadAuthenticated(
  authenticatedRouter: AppLoader,
  pendingRouter: AppLoader = loadingRouter,
) {
  return switchAuth({
    authenticated: authenticatedRouter,
    pending: pendingRouter,
    unauthenticated: loadRedirect(
      (request) =>
        '/login?redirectTo=' + encodeURIComponent(createHref(request.nav)),
    ),
  })
}

export function loadWhenUnauthenticated(
  unauthenticatedHandler: AppLoader,
  redirectLocation: string | NavAction | ((env: NavEnv) => string | NavAction),
  pendingHandler: AppLoader = loadingRouter,
) {
  return switchAuth({
    authenticated: loadRedirect(redirectLocation),
    pending: pendingHandler,
    unauthenticated: unauthenticatedHandler,
  })
}

export function loadWithMutablePersistedContext(
  loader: AppLoader,
  mutablePersistedContext: AppMutablePersistedContext,
): AppLoader {
  return (env) => {
    Object.assign(env.mutablePersistedContext, mutablePersistedContext)
    return loader(env)
  }
}
