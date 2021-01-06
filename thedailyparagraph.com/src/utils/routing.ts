import { NextilRequest, NextilResponse, nextilRoutedPage } from 'nextil'
import {
  RouterAction,
  RouterFunction,
  // RouterResponse,
  createHref,
  routeRedirect,
  useRouterRequest,
} from 'retil-router'
import { createMemo } from 'retil-support'
import { Client } from 'urql'

import { router as loadingRouter } from 'src/routers/loading'

import { AuthUser, getAuthService } from './auth'
import { CreatePrecachedQueryFunction, getURQLState } from './graphql'
import { MemberProfile, getMemberProfileSource } from './memberProfile'

export interface AppUser extends Omit<AuthUser, 'id'> {
  memberId?: string
}

export type AppRequest = NextilRequest & {
  cache?: any
  client: Client
  createQuery: CreatePrecachedQueryFunction
  user?: null | AppUser
  profile?: null | MemberProfile

  // currentUser?: null | AuthUser
  doNotTrack?: boolean

  // This is a mutable object which can be modified by routes to configure
  // how the layout behaves.
  layoutOptions: {
    disableSearch?: boolean
  }
}

export type AppRouterFunction = RouterFunction<AppRequest, NextilResponse>

const authMemo = createMemo()

export function appRoutedPage(pageRouter: AppRouterFunction) {
  return nextilRoutedPage(pageRouter, {
    extendRequest: (request, use) => {
      const [authSource, authController] = getAuthService(request)
      const auth = use(authSource, undefined)
      const memberId =
        auth === undefined
          ? undefined
          : auth?.user?.claims?.['https://hasura.io/jwt/claims']?.[
              'x-hasura-user-id'
            ] || null
      const user =
        !auth || !auth.user
          ? (auth?.user as null | undefined)
          : authMemo(
              () => ({
                ...(auth.user as AuthUser),
                id: undefined,
                memberId,
              }),
              [auth.user, memberId],
            )

      const { client, cache, createQuery } = getURQLState(
        request,
        authController,
      )

      const profileSource =
        user && getMemberProfileSource(request, client, memberId)

      return {
        cache,
        client,
        createQuery,
        user: user,
        profile: profileSource && use(profileSource),
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
    return (request.profile === undefined
      ? routers.pending
      : request.user && !request.user.isAnonymous
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
