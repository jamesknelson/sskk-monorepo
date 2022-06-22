import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import { getDefaultHydrationEnvService } from 'retil-hydration'
import { createState, fuse, getSnapshot, Source } from 'retil-source'

import { customerRole, graphqlURL } from '~/config'
import { PrecachedQuery, QueryContext } from '~/data/precachedQuery'

import { DataEnv } from './env'
import { AuthTokenInfoGetter } from './auth'

export type SessionTokenSetter = (sessionToken: string | null) => void

export function createBrowserDataEnvService(
  getTokenInfo?: AuthTokenInfoGetter,
  serializedData?: any,
  initialSessionToken?: string | null,
): readonly [Source<DataEnv>, SessionTokenSetter] {
  let client: ApolloClient<any>

  const [sessionTokenSource, setSessionToken] = createState(initialSessionToken)

  const precacheQuery = async <Result = any, Variables extends object = object>(
    document: DocumentNode<Result, Variables>,
    defaultVariables: Variables = {} as Variables,
    context: QueryContext = {},
  ): Promise<PrecachedQuery<Result, Variables>> => {
    const cachedData = client.readQuery({
      query: document,
      variables: defaultVariables,
    })

    const [hydrationEnvSource] = getDefaultHydrationEnvService()
    const hasHydrated = getSnapshot(hydrationEnvSource).hydrating === false
    const shouldFetch = cachedData === null || hasHydrated

    let data = cachedData
    if (shouldFetch) {
      const result = await client.query({
        query: document,
        variables: defaultVariables,
        context,
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
      context,
      variables: defaultVariables!,
      data: data!,
    }
  }

  const cache = new InMemoryCache().restore(serializedData)
  const httpLink = new HttpLink({ uri: graphqlURL, credentials: 'include' })

  const authMiddleware = setContext(async (_, previousContext) => {
    const role = previousContext.role
    const headers = { ...previousContext.headers } as Record<string, string>

    if (role && role !== 'anonymous') {
      if (!getTokenInfo) {
        throw new Error('Forbidden as unauthenticated')
      }

      const tokenInfo = await getTokenInfo()
      const customerId = tokenInfo?.['claims']?.customer_id
      const sessionToken = getSnapshot(sessionTokenSource)

      if (customerId) {
        headers['Authorization'] = `Bearer ${tokenInfo!.token}`
        headers['X-Hasura-Role'] = role || customerRole
      }
      if (sessionToken) {
        headers['X-SSKK-Session'] = sessionToken
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

  const source = fuse((use) => {
    const sessionId = use(sessionTokenSource)
    return {
      client,
      precacheQuery,
      sessionId,
    }
  })

  return [source, setSessionToken] as const
}
