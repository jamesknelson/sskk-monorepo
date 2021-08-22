import { getDefaultHydrationEnvService } from 'retil-hydration'
import { fuseEnvSource } from 'retil-mount'
import { getDefaultBrowserNavEnvService } from 'retil-nav'
import { createMemo } from 'retil-support'

import { AppEnv } from './appEnv'
import { AuthUser, getAuthService } from './auth'
import { getBrowserDataEnvSource } from './browserDataEnv'
import { getMemberProfileSource } from './memberProfile'

const authMemo = createMemo()
const defaultLayoutOptions = {}

const [hydrationEnvSource] = getDefaultHydrationEnvService()
const [navEnvSource] = getDefaultBrowserNavEnvService()

export function createBrowserAppEnvSource(dataCache: any) {
  return fuseEnvSource((use) => {
    const hydrationEnv = use(hydrationEnvSource)
    const navEnv = use(navEnvSource)

    const hasHydrated = hydrationEnv.hydrating === false

    const [authSource, authController] = getAuthService()

    // We don't want to use the auth source until hydration is complete,
    // as we don't want it to trigger any renders and cause the initial
    // content to be nuked.
    const auth = hasHydrated ? use(authSource) : undefined
    const dataEnv = use(
      getBrowserDataEnvSource(auth, authController, dataCache),
    )

    const env: AppEnv = {
      ...navEnv,
      ...dataEnv,
      authUser: undefined,
      hasHydrated,
      head: [],
      layoutOptions: { ...defaultLayoutOptions },
      profile: undefined,
    }

    if (hasHydrated && auth !== undefined) {
      const memberId =
        auth === undefined
          ? undefined
          : auth?.user?.claims?.['https://hasura.io/jwt/claims']?.[
              'x-hasura-user-id'
            ] || null
      const authUser =
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
        authUser &&
        getMemberProfileSource(hydrationEnv, dataEnv.client, memberId)

      Object.assign(env, {
        user: authUser,
        profile: profileSource && use(profileSource),
      })
    }

    return env
  })
}
