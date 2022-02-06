import { getDefaultHydrationEnvService } from 'retil-hydration'
import { getDefaultBrowserNavEnvService } from 'retil-nav'
import { fuse } from 'retil-source'

import { getAuthService } from './auth'
import { createBrowserDataEnvService } from './browserDataEnv'
import {
  createCustomerIdentitySource,
  loginCustomerIdentity,
} from './customerIdentity'
import { Env } from './env'

const defaultLayoutOptions = {}

const [hydrationEnvSource] = getDefaultHydrationEnvService()
const [navEnvSource] = getDefaultBrowserNavEnvService()

export function createBrowserAppEnvSource(initialSerializedData?: {
  cache: any
  context: any
}) {
  return fuse((use, act, memo) => {
    const hydrationEnv = use(hydrationEnvSource)
    const navEnv = use(navEnvSource)
    const hasHydrated = hydrationEnv.hydrating === false

    // We don't want to use the auth source until hydration is complete,
    // as we don't want it to trigger any renders and cause the initial
    // content to be nuked.
    const auth = hasHydrated ? use(getAuthService()[0]) : undefined

    const [dataEnvSource, setSessionToken] = memo(createBrowserDataEnvService, [
      auth?.user?.getTokenInfo,
      hasHydrated ? undefined : initialSerializedData?.cache,
    ])

    const dataEnv = use(dataEnvSource)

    // If we've authenticated a user via firebase, but haven't yet logged them
    // into the app, then go ahead and do that.
    if (auth?.user && dataEnv.sessionId === undefined) {
      return act(async () => {
        const sessionToken = await loginCustomerIdentity(dataEnv.client)
        setSessionToken(sessionToken)
      })
    }

    const customerId = auth?.user?.claims.customer_id
    const customerIdentitySource =
      customerId &&
      memo(createCustomerIdentitySource, [dataEnv.client, customerId])

    const env: Env = {
      ...navEnv,
      ...dataEnv,
      ...hydrationEnv,
      authUser: auth?.user,
      customerIdentity:
        auth?.user === null
          ? null
          : customerIdentitySource && use(customerIdentitySource),
      hasHydrated,
      head: [],
      mutablePersistedContext: {
        ...defaultLayoutOptions,
        ...(hasHydrated ? null : initialSerializedData?.context),
      },
    }

    return env
  })
}
