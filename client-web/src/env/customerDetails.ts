import { HydrationEnv } from 'retil-hydration'
import { Source, createState, fromPromise } from 'retil-source'
import { createMemo } from 'retil-support'

import * as roles from 'src/constants/roles'
import { LoginDocument, CustomerDetailsFragment } from 'src/generated/graphql'

import type { AppApolloClient } from './appEnv'

export type CustomerDetails = CustomerDetailsFragment
export type CustomerDetailsSource = Source<CustomerDetails | null | undefined>
export interface CustomerDetailsHandle {
  getSessionToken(): string | null
}
export type CustomerDetailsService = readonly [
  CustomerDetailsSource,
  CustomerDetailsHandle,
]

const serviceMemo = createMemo<CustomerDetailsService>()
const nullService: CustomerDetailsService = [
  createState(undefined)[0],
  {
    getSessionToken: () => null,
  },
]

export function getCustomerDetailsService(
  request: HydrationEnv,
  client: AppApolloClient,
  customerId: string | null,
): CustomerDetailsService {
  if (request.hydrating !== false) {
    return nullService
  } else {
    return serviceMemo(() => {
      let sessionToken: null | string = null
      const profilePromise = client
        .mutate({
          mutation: LoginDocument,
          context: {
            role: roles.customer,
          },
        })
        .then(({ data }) => {
          sessionToken = data?.login?.session_token || null
          return data?.login?.customer || null
        })
      return [
        fromPromise(profilePromise),
        {
          getSessionToken: () => sessionToken,
        },
      ]
    }, [client, customerId])
  }
}
