import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import {
  Client,
  Exchange,
  Operation,
  OperationContext,
  RequestPolicy,
  createClient,
  createRequest,
  dedupExchange,
  fetchExchange,
  makeOperation,
  ssrExchange,
} from '@urql/core'
import { cacheExchange } from '@urql/exchange-graphcache'
import { NextilRequest } from 'nextil'
import { isPromiseLike } from 'retil-support'
import { UseQueryState, useQuery } from 'urql'
import {
  pipe,
  mergeMap,
  fromPromise,
  fromValue,
  map,
  take,
  toPromise,
} from 'wonka'

import { graphqlURL } from 'src/config'

import { AuthController } from './auth'
import { useMemo } from 'react'

interface URQLState {
  cache?: any
  client: Client
  createQuery: CreatePrecachedQueryFunction
}

const clientStateRef: { current?: URQLState } = {}
const serverStates = new WeakMap<any, URQLState>()

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

export type UseQueryResponse<Result = any, Variables = object> = [
  UseQueryState<Result, Variables> & { data: Result },
  (opts?: Partial<OperationContext>) => void,
]

export interface UseQueryArgs<Result = any, Variables extends object = object> {
  query: null | PrecachedQuery<Result, Variables>
  variables?: Variables
  requestPolicy?: RequestPolicy
  pollInterval?: number
  context?: Partial<OperationContext>
  pause?: boolean
}

export function usePrecachedQuery<
  Result = any,
  Variables extends object = object
>(args: UseQueryArgs<Result, Variables>): UseQueryResponse<Result, Variables> {
  const context = useMemo(() => ({ role: args.query?.role, suspense: false }), [
    args.query?.role,
  ])

  const variables = {
    ...args.query?.variables,
    ...args.variables,
  }

  const [result, trigger] = useQuery({
    ...args,
    query: args.query?.document || `query Empty { void }`,
    variables,
    context,
    pause: args.query === null,
    requestPolicy: 'cache-and-network',
  })

  return [
    result as UseQueryState<Result, Variables> & { data: Result },
    trigger,
  ]
}

// TODO: if currentUser has an id and changes, then create a new cache.
export function getURQLState(
  request: NextilRequest,
  authController: AuthController,
): URQLState {
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
        const query = client.executeQuery(
          createRequest(document, defaultVariables),
          {
            role,
            // CAUTION: cache-and-network DOES NOT WORK with toPromise, and
            // while it's possible to manually make it work by looking at
            // the second and subsequent values output by the query, this
            // will cause the newly cached value to disappear because urql
            // does not allow for access to a cached value while there's a
            // network request in progress.
            requestPolicy: 'cache-first',
            suspense: false,
          },
        )

        const result = await pipe(query, take(1), toPromise)

        if (result.error) {
          throw result.error
        }

        return result.data!
      },
    }
  }

  if (request.serverRequest) {
    let state = serverStates.get(request.serverRequest)
    if (!state) {
      const cache = ssrExchange({
        isClient: false,
      })
      client = createClient({
        url: graphqlURL,
        exchanges: [
          dedupExchange,
          cacheExchange(cacheExchangeConfig),
          cache,
          fetchExchange,
        ],
      })
      state = { cache, client, createQuery }
      serverStates.set(request.serverRequest, state)
    }
    return state
  }

  client = createClient({
    exchanges: [
      dedupExchange,
      cacheExchange(cacheExchangeConfig),
      ssrExchange({
        isClient: true,
        initialState: request.serializedData,
      }),
      fetchOptionsExchange(async (context: any) => {
        if (!context.role || context.role === 'anonymous') {
          return context.fetchOptions
        }

        const fetchOptions = context.fetchOptions
        const tokenInfo = await authController.getTokenInfo()
        const headers = {
          ...fetchOptions?.headers,
        }

        const userId =
          tokenInfo?.['claims']?.['https://hasura.io/jwt/claims']?.[
            'x-hasura-user-id'
          ]

        if (userId) {
          headers['Authorization'] = `Bearer ${tokenInfo!.token}`
          headers['X-Hasura-Role'] = context.role || 'member'

          // WARNING: in production this header will be set by hasura based on
          // the signed token's claims. However, in development mode, Hasura
          // requires us to set it manually.
          headers['X-Hasura-User-Id'] = userId
        }

        return {
          ...fetchOptions,
          headers,
        }
      }),
      fetchExchange,
    ],
    url: graphqlURL,
  })

  if (!request.isSSR) {
    clientStateRef.current = { client, createQuery }
  }

  return { client, createQuery }
}

export const cacheExchangeConfig = {}

export const fetchOptionsExchange = (fn: any): Exchange => ({ forward }) => (
  ops$,
) => {
  return pipe(
    ops$,
    mergeMap((operation: Operation) => {
      const result = fn(operation.context)
      return pipe(
        isPromiseLike(result)
          ? fromPromise(Promise.resolve(result))
          : fromValue(result),
        map((fetchOptions: RequestInit | (() => RequestInit)) =>
          makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions,
          }),
        ),
      )
    }),
    forward,
  )
}
