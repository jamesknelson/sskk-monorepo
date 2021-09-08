import { HydrationEnv } from 'retil-hydration'
import { Source, createState, fromPromise } from 'retil-source'
import { createMemo } from 'retil-support'

import * as roles from 'src/constants/roles'
import {
  CustomerLoginDocument,
  CustomerDetailsFragment,
} from 'src/generated/graphql'

import type { AppApolloClient } from './appEnv'

export type CustomerDetails = CustomerDetailsFragment
export type CustomerDetailsSource = Source<CustomerDetails | null | undefined>

const sourceMemo = createMemo<CustomerDetailsSource>()

export function getCustomerDetailsSource(
  request: HydrationEnv,
  client: AppApolloClient,
  customerId: string | null,
): CustomerDetailsSource {
  if (request.hydrating !== false) {
    return createState(undefined)[0]
  } else {
    return sourceMemo(() => {
      const profilePromise = client
        .mutate({
          mutation: CustomerLoginDocument,
          context: {
            role: roles.customer,
          },
        })
        .then(({ data }) => data?.login?.customer || null)
      return fromPromise(profilePromise)
    }, [client, customerId])
  }
}
