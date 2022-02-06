import { ApolloQueryResult } from '@apollo/client'
import { observe, Source } from 'retil-source'

import { customerRole } from '~/config'
import type { AppApolloClient } from '~/data/apollo'
import {
  CustomerIdentityByIdDocument,
  CustomerIdentityByIdQuery,
  CustomerIdentityFragment,
  LoginDocument,
} from '~/data/graphql'

export type CustomerIdentity = CustomerIdentityFragment
export type CustomerIdentitySource = Source<CustomerIdentity | null | undefined>
export interface CustomerIdentityHandle {
  getSessionToken(): string | null
}
export type CustomerIdentityService = readonly [
  CustomerIdentitySource,
  CustomerIdentityHandle,
]

export function createCustomerIdentitySource(
  client: AppApolloClient,
  customerId: string,
) {
  return observe((next, error, complete) => {
    const query = client.watchQuery({
      fetchPolicy: 'cache-only',
      query: CustomerIdentityByIdDocument,
      variables: {
        customerId,
      },
    })

    const handleResult = (
      result: ApolloQueryResult<CustomerIdentityByIdQuery>,
    ) => {
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

export async function loginCustomerIdentity(
  client: AppApolloClient,
): Promise<string | null> {
  const { data } = await client.mutate({
    mutation: LoginDocument,
    context: {
      role: customerRole,
    },
  })

  const sessionToken = data?.login?.session_token || null
  const customer = data?.login?.customer

  if (customer) {
    client.writeQuery({
      query: CustomerIdentityByIdDocument,
      data: {
        // Contains the data to write
        customer,
      },
      variables: {
        customerId: customer.id,
      },
    })
  }

  return sessionToken
}
