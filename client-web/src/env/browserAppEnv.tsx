import { getDefaultHydrationEnvService } from 'retil-hydration'
import { fuseEnvSource } from 'retil-mount'
import { getDefaultBrowserNavEnvService } from 'retil-nav'
import { createMemo } from 'retil-support'

import { AppEnv } from './appEnv'
import { AuthUser, getAuthService } from './auth'
import { getBrowserDataEnvSource } from './browserDataEnv'
import { getCustomerDetailsSource } from './customerDetails'

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
      ...hydrationEnv,
      authUser: undefined,
      customer: undefined,
      hasHydrated,
      head: [],
      layoutOptions: { ...defaultLayoutOptions },
    }

    if (hasHydrated && auth !== undefined) {
      const customerId =
        auth === undefined ? undefined : auth?.user?.claims?.customer_id || null
      const authUser =
        !auth || !auth.user
          ? (auth?.user as null | undefined)
          : authMemo(
              () => ({
                ...(auth.user as AuthUser),
                id: undefined,
                customerId,
              }),
              [auth.user, customerId],
            )
      const customerSource =
        authUser &&
        getCustomerDetailsSource(hydrationEnv, dataEnv.client, customerId)

      Object.assign(env, {
        authUser: authUser,
        customer: customerSource && use(customerSource),
      })
    }

    return env
  })
}
