import {
  ApolloClient,
  FetchPolicy,
  HttpLink,
  InMemoryCache,
  QueryResult,
  useQuery,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import gql from 'graphql-tag'
import { NextilRequest } from 'nextil'
import { useMemo } from 'react'

import { graphqlURL } from 'src/config'

import { AuthController } from './auth'

export type Client = ApolloClient<any>

interface GraphQLClientState {
  cache?: any
  client: Client
  createQuery: CreatePrecachedQueryFunction
}

const clientStateRef: { current?: GraphQLClientState } = {}
const serverStates = new WeakMap<any, GraphQLClientState>()

export type CreatePrecachedQueryFunction = <Result, Variables extends object>(
  node: DocumentNode<Result, Variables>,
  variables?: Variables,
  role?: string,
) => PrecachedQuery<Result, Variables>

export interface PrecachedQuery<Result, Variables extends object = object> {
  client: Client
  document: DocumentNode<Result, Variables>
  role?: string
  variables: Variables

  precache: () => Promise<Result>
}

export type UseQueryResponse<Result = any, Variables = object> = QueryResult<
  Result,
  Variables
> & {
  // Remove possibility of `undefined`
  data: Result
}

export interface UseQueryArgs<Variables extends object = object> {
  variables?: Variables
  requestPolicy?: FetchPolicy
  pollInterval?: number
  context?: any
  pause?: boolean
}

const emptyQuery = gql`
  query Empty {
    void
  }
`

export function usePrecachedQuery<
  Result = any,
  Variables extends object = object
>(
  query: null | PrecachedQuery<Result, Variables>,
  args: UseQueryArgs<Variables> = {},
): UseQueryResponse<Result, Variables> {
  const context = useMemo(() => ({ role: query?.role, suspense: false }), [
    query?.role,
  ])

  const variables = {
    ...query?.variables,
    ...args.variables,
  }

  const result = useQuery(query?.document || emptyQuery, {
    ...args,
    variables,
    context,
    skip: query === null,
    fetchPolicy: 'cache-first',
  })

  return result as UseQueryResponse<Result, Variables>
}

// TODO: if currentUser has an id and changes, then create a new cache.
export function getGraphQLClientState(
  request: NextilRequest,
  authController: AuthController,
): GraphQLClientState {
  if (clientStateRef.current) {
    return clientStateRef.current
  }

  let client: Client

  const createQuery = <Result = any, Variables extends object = object>(
    document: DocumentNode<Result, Variables>,
    defaultVariables: Variables = {} as Variables,
    role?: string,
  ): PrecachedQuery<Result, Variables> => {
    return {
      client,
      document,
      role,
      variables: defaultVariables!,

      precache: async () => {
        const cachedData = client.readQuery({
          query: document,
          variables: defaultVariables,
        })

        const networkResultPromise = client.query({
          query: document,
          variables: defaultVariables,
          context: {
            role,
          },
          fetchPolicy: 'network-only',
        })

        if (cachedData === null) {
          const result = await networkResultPromise
          if (result.error) {
            throw result.error
          }
          return result.data
        } else {
          return cachedData
        }
      },
    }
  }

  if (request.serverRequest) {
    let state = serverStates.get(request.serverRequest)
    if (!state) {
      const cache = new InMemoryCache()
      client = new ApolloClient({
        uri: graphqlURL,
        cache,
      })
      state = { cache, client, createQuery }
      serverStates.set(request.serverRequest, state)
    }
    return state
  } else {
    const cache = new InMemoryCache().restore(request.serializedData)

    const link = new HttpLink({ uri: graphqlURL })
    const authMiddleware = setContext(async (_, previousContext) => {
      const role = previousContext.role
      const headers = { ...previousContext.headers } as Record<string, string>

      if (role && role !== 'anonymous') {
        const tokenInfo = await authController.getTokenInfo()
        const userId =
          tokenInfo?.['claims']?.['https://hasura.io/jwt/claims']?.[
            'x-hasura-user-id'
          ]

        if (userId) {
          headers['Authorization'] = `Bearer ${tokenInfo!.token}`
          headers['X-Hasura-Role'] = role || 'member'

          // WARNING: in production this header will be set by hasura based on
          // the signed token's claims. However, in development mode, Hasura
          // requires us to set it manually.
          headers['X-Hasura-User-Id'] = userId
        }
      }

      return { ...previousContext, headers }
    })

    client = new ApolloClient({
      cache,
      link: authMiddleware.concat(link),
    })

    clientStateRef.current = { client, createQuery }

    return { client, createQuery }
  }
}
