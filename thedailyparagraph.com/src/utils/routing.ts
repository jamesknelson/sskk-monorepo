import { NextilRequest, NextilResponse, nextilRoutedPage } from 'nextil'
import {
  RouterAction,
  RouterFunction,
  // RouterResponse,
  createHref,
  routeRedirect,
  useRouterRequest,
} from 'retil-router'
import { Client } from 'urql'

import { router as loadingRouter } from '../routers/loading'

import { AuthUser, getAuthService } from './auth'
import { CreatePrecachedQueryFunction, getURQLState } from './graphql'

export type AppRequest = NextilRequest & {
  cache?: any
  client: Client
  createQuery: CreatePrecachedQueryFunction
  currentUser?: null | AuthUser

  // currentUser?: null | AuthUser
  doNotTrack?: boolean

  // This is a mutable object which can be modified by routes to configure
  // how the layout behaves.
  layoutOptions: {
    disableSearch?: boolean
  }
}

export type AppRouterFunction = RouterFunction<AppRequest, NextilResponse>

export function appRoutedPage(pageRouter: AppRouterFunction) {
  return nextilRoutedPage(pageRouter, {
    extendRequest: (request, use) => {
      const [authSource, authController] = getAuthService(request)
      const auth = use(authSource, undefined)
      const { client, cache, createQuery } = getURQLState(
        request,
        authController,
      )
      return {
        cache,
        client,
        createQuery,
        currentUser: auth === undefined ? undefined : auth.user,
        layoutOptions: {},
      }
    },

    extractSerializedData: (request) => request.cache?.extractData?.(),
  })
}

export function useAppRequest(): AppRequest {
  return useRouterRequest<AppRequest>()
}

export function switchAuth(routers: {
  authenticated: AppRouterFunction
  pending: AppRouterFunction
  unauthenticated: AppRouterFunction
}): AppRouterFunction {
  return (request, response) => {
    return (request.currentUser === undefined
      ? routers.pending
      : request.currentUser && !request.currentUser.isAnonymous
      ? routers.authenticated
      : routers.unauthenticated)(request, response)
  }
}

export function requireAuth(
  authenticatedRouter: AppRouterFunction,
  pendingRouter: AppRouterFunction = loadingRouter,
) {
  return switchAuth({
    authenticated: authenticatedRouter,
    pending: pendingRouter,
    unauthenticated: routeRedirect(
      (request) =>
        '/login?redirectTo=' + encodeURIComponent(createHref(request)),
    ),
  })
}

export function requireNoAuth(
  unauthenticatedHandler: AppRouterFunction,
  redirectLocation:
    | string
    | RouterAction
    | ((request: AppRequest) => string | RouterAction),
  pendingHandler: AppRouterFunction = loadingRouter,
) {
  return switchAuth({
    authenticated: routeRedirect(redirectLocation),
    pending: pendingHandler,
    unauthenticated: unauthenticatedHandler,
  })
}
