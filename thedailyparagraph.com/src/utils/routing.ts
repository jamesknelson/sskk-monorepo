import { InMemoryCache } from '@apollo/client'
import { NextilRequest, NextilResponse, nextilRoutedPage } from 'nextil'
import {
  RouterAction,
  RouterFunction,
  createHref,
  routeRedirect,
  useRouterRequest,
} from 'retil-router'
import { createMemo } from 'retil-support'

import { router as loadingRouter } from 'src/routers/loading'

import { AuthUser, getAuthService } from './auth'
import {
  Client,
  CreatePrecachedQueryFunction,
  getGraphQLClientState,
} from './graphql'
import { hasHydratedSource } from './boundary'
import { MemberProfile, getMemberProfileSource } from './memberProfile'
import { encodeUUID } from './uuid'

export interface AppUser extends Omit<AuthUser, 'id'> {
  memberId?: string
}

// This is a mutable object which can be modified by routes to configure
// how the layout behaves.
export interface AppLayoutOptions {
  scrollingHeader?: {
    from: string
    to: string
  }
}

export type AppRequest = NextilRequest & {
  cache?: InMemoryCache
  client: Client
  createQuery: CreatePrecachedQueryFunction
  user?: null | AppUser
  profile?: null | MemberProfile

  doNotTrack?: boolean
  hasHydrated: boolean

  layoutOptions: AppLayoutOptions
}

export type AppRouterFunction = RouterFunction<AppRequest, NextilResponse>

const authMemo = createMemo()
const defaultLayoutOptions = {}

export function appRoutedPage(pageRouter: AppRouterFunction) {
  return nextilRoutedPage(pageRouter, {
    extendRequest: (request, use) => {
      const hasHydrated = use(hasHydratedSource)
      const [authSource, authController] = getAuthService()

      // We don't want to use the auth source until hydration is complete,
      // as we don't want it to trigger any renders and cause the initial
      // content to be nuked.
      const auth = hasHydrated ? use(authSource) : undefined

      const { client, cache, createQuery } = getGraphQLClientState(
        authController,
        request.serializedData,
      )
      const extension = {
        cache,
        client,
        createQuery,
        hasHydrated,
        layoutOptions: { ...defaultLayoutOptions },
        profile: undefined,
        user: undefined,
      }

      if (hasHydrated && auth !== undefined) {
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
        const profileSource =
          user && getMemberProfileSource(request, client, memberId)

        Object.assign(extension, {
          user,
          profile: profileSource && use(profileSource),
        })
      }

      return extension
    },

    extractSerializedData: async (request) => request.cache?.extract(),
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

export function getStoryPath(options: {
  profileId: string
  profileHandle?: string | null
  publishedAt?: Date
  storyId?: string | null
  storySlug?: string | null
}) {
  const slug =
    options.publishedAt && options.publishedAt <= new Date()
      ? options.storySlug
      : null
  return `/@${options.profileHandle || encodeUUID(options.profileId)}/${
    slug ? slug : '~' + encodeUUID(options.storyId!)
  }`
}

export function routeWithLayoutOptions(
  router: AppRouterFunction,
  layoutOptions: AppLayoutOptions,
) {
  return (req: AppRequest, res: NextilResponse) => {
    Object.assign(req.layoutOptions, layoutOptions)
    return router(req, res)
  }
}
