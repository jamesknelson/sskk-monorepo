import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import { getDefaultHydrationEnvService } from 'retil-hydration'
import { Source, constant, getSnapshot } from 'retil-source'

import { graphqlURL } from 'src/config'
import * as roles from 'src/constants/roles'
import { Role } from 'src/constants/roles'
import { PrecachedQuery } from 'src/utils/precachedQuery'

import { DataEnv } from './appEnv'
import { AuthController, AuthSnapshot } from './auth'

const clientStateRef: { current?: Source<DataEnv> } = {}

export function getBrowserDataEnvSource(
  _authSnapshot?: AuthSnapshot | null,
  authController?: AuthController | null,
  serializedData?: any,
): Source<DataEnv> {
  // TODO: if currentUser has an id and changes, then create a new cache.
  if (clientStateRef.current) {
    return clientStateRef.current
  }

  let client: ApolloClient<any>

  const precacheQuery = async <Result = any, Variables extends object = object>(
    document: DocumentNode<Result, Variables>,
    defaultVariables: Variables = {} as Variables,
    role?: Role,
  ): Promise<PrecachedQuery<Result, Variables>> => {
    const cachedData = client.readQuery({
      query: document,
      variables: defaultVariables,
    })

    const [hydrationEnvSource] = getDefaultHydrationEnvService()
    const hasHydrated = getSnapshot(hydrationEnvSource)[1].hydrating === false
    const shouldFetch = cachedData === null || hasHydrated

    let data = cachedData
    if (shouldFetch) {
      const result = await client.query({
        query: document,
        variables: defaultVariables,
        context: {
          role,
        },
        fetchPolicy: 'network-only',
      })

      if (result.error) {
        throw result
      }

      data = result.data
    }

    return {
      client,
      document,
      role,
      variables: defaultVariables!,
      data: data!,
    }
  }

  const cache = new InMemoryCache().restore(serializedData)

  const httpLink = new HttpLink({ uri: graphqlURL, credentials: 'include' })
  const authMiddleware = setContext(async (_, previousContext) => {
    const role = previousContext.role
    const headers = { ...previousContext.headers } as Record<string, string>

    if (authController && role && role !== 'anonymous') {
      const tokenInfo = await authController.getTokenInfo()
      const customerId = tokenInfo?.['claims']?.customer_id

      if (customerId) {
        headers['Authorization'] = `Bearer ${tokenInfo!.token}`
        headers['X-Hasura-Role'] = role || roles.customer
      }
    }
    if (!headers['X-Hasura-Role']) {
      headers['X-Hasura-Role'] = 'anonymous'
    }

    return { ...previousContext, headers }
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )

    if (networkError) console.error(`[Network error]: ${networkError}`)
  })

  client = new ApolloClient({
    cache,
    link: from([errorLink, authMiddleware, httpLink]),
  })

  clientStateRef.current = constant({ client, precacheQuery })

  return clientStateRef.current
}
