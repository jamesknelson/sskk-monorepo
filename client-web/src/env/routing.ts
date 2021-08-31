import { Loader } from 'retil-mount'
import { NavAction, createHref, loadRedirect, NavEnv } from 'retil-nav'

import loadingRouter from 'src/pages/loadingLoader'

import { AppEnv, AppLayoutOptions } from './appEnv'

export type AppLoader = Loader<AppEnv>

export function switchAuth(routers: {
  authenticated: AppLoader
  pending: AppLoader
  unauthenticated: AppLoader
}): AppLoader {
  return (request) => {
    return (
      request.profile === undefined
        ? routers.pending
        : request.authUser && !request.authUser.isAnonymous
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

export function loadWithLayoutOptions(
  loader: AppLoader,
  layoutOptions: AppLayoutOptions,
): AppLoader {
  return (env) => {
    Object.assign(env.layoutOptions, layoutOptions)
    return loader(env)
  }
}
