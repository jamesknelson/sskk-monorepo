import { Loader } from 'retil-mount'
import { NavAction, createHref, loadRedirect, NavEnv } from 'retil-nav'

import loadingLoader from '~/app/loadingLoader'
import { Env, AppMutablePersistedContext } from '~/env'

export type AppLoader = Loader<Env>

export function switchAuth(routers: {
  authenticated: AppLoader
  pending: AppLoader
  unauthenticated: AppLoader
}): AppLoader {
  return (request) => {
    return (
      request.customerIdentity === undefined
        ? routers.pending
        : request.authUser
        ? routers.authenticated
        : routers.unauthenticated
    )(request)
  }
}

export function loadAuthenticated(
  authenticatedRouter: AppLoader,
  pendingRouter: AppLoader = loadingLoader,
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
  pendingHandler: AppLoader = loadingLoader,
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
