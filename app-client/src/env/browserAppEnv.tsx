import { ApolloClient, ApolloQueryResult } from '@apollo/client'
import { getDefaultHydrationEnvService } from 'retil-hydration'
import { getDefaultBrowserNavEnvService } from 'retil-nav'
import { fuse, observe } from 'retil-source'

import { customerRole } from 'src/config'
import {
  LoginDocument,
  CustomerDetailsDocument,
  CustomerDetailsFragment,
  CustomerDetailsQuery,
} from 'src/graphql'

import { AppEnv } from './appEnv'
import { getAuthService } from './auth'
import { createBrowserDataEnvService } from './browserDataEnv'

const defaultLayoutOptions = {}

const [hydrationEnvSource] = getDefaultHydrationEnvService()
const [navEnvSource] = getDefaultBrowserNavEnvService()

export type CustomerDetails = CustomerDetailsFragment

export function createCustomerDetailsSource(
  client: ApolloClient<any>,
  customerId: string,
) {
  return observe((next, error, complete) => {
    const query = client.watchQuery({
      fetchPolicy: 'cache-only',
      query: CustomerDetailsDocument,
      variables: {
        customerId,
      },
    })

    const handleResult = (result: ApolloQueryResult<CustomerDetailsQuery>) => {
      const errors = result.error || result.errors
      if (errors) {
        error(errors)
        return
      }

      if (result.data) {
        next(result.data.customer)
      }
    }

    handleResult(query.getCurrentResult())

    return query.subscribe({
      next: handleResult,
      error: error,
      complete,
    })
  })
}

export function createBrowserAppEnvSource(initialSerializedData?: {
  cache: any
  context: any
}) {
  return fuse((use, act, memo) => {
    const hydrationEnv = use(hydrationEnvSource)
    const navEnv = use(navEnvSource)

    const hasHydrated = hydrationEnv.hydrating === false

    const [authSource] = getAuthService()

    // We don't want to use the auth source until hydration is complete,
    // as we don't want it to trigger any renders and cause the initial
    // content to be nuked.
    const auth = hasHydrated ? use(authSource) : undefined
    const [dataEnvSource, setSessionToken] = memo(createBrowserDataEnvService, [
      auth?.user?.getTokenInfo,
      hasHydrated ? undefined : initialSerializedData?.cache,
    ])

    const dataEnv = use(dataEnvSource)

    if (auth?.user && dataEnv.sessionId === undefined) {
      return act(async () => {
        const { data } = await dataEnv.client.mutate({
          mutation: LoginDocument,
          context: {
            role: customerRole,
          },
        })

        const sessionToken = data?.login?.session_token || null
        const customer = data?.login?.customer

        if (customer) {
          dataEnv.client.writeQuery({
            query: CustomerDetailsDocument,
            data: {
              // Contains the data to write
              customer,
            },
            variables: {
              customerId: customer.id,
            },
          })
        }

        setSessionToken(sessionToken)
      })
    }

    const customerId = auth?.user?.claims.customer_id
    const customerSource =
      customerId &&
      memo(createCustomerDetailsSource, [dataEnv.client, customerId])

    const env: AppEnv = {
      ...navEnv,
      ...dataEnv,
      ...hydrationEnv,
      authUser: auth?.user,
      customer:
        auth?.user === null ? null : customerSource && use(customerSource),
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
