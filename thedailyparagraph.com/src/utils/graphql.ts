import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import {
  Client,
  Exchange,
  Operation,
  OperationContext,
  RequestPolicy,
  createClient,
  dedupExchange,
  fetchExchange,
  makeOperation,
  ssrExchange,
} from '@urql/core'
import { cacheExchange } from '@urql/exchange-graphcache'
import { NextilRequest } from 'nextil'
import { isPromiseLike } from 'retil-support'
import { UseQueryState, useQuery } from 'urql'
import { pipe, mergeMap, fromPromise, fromValue, map } from 'wonka'

import { graphqlURL } from 'src/config'

import { AuthController } from './auth'

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
) => PrecachedQuery<Result, Variables>

export interface PrecachedQuery<Result, Variables extends object = object> {
  client: Client
  document: DocumentNode<Result, Variables>
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
  const [result, trigger] = useQuery({
    ...args,
    query: args.query?.document || `query Empty { void }`,
    variables: {
      ...args.query?.variables,
      ...args.variables,
    },
    pause: args.query === null,
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
  ): PrecachedQuery<Result, Variables> => {
    return {
      client,
      document,
      variables: defaultVariables!,

      precache: async () => {
        const { data, error } = await client
          .query(document, defaultVariables)
          .toPromise()

        if (error) {
          throw error
        }

        return data!
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

        return {
          ...fetchOptions,
          headers: {
            ...fetchOptions?.headers,
            Authorization: `Bearer ${tokenInfo?.token}`,
            // 'X-Hasura-Role': context.role,
          },
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

export const cacheExchangeConfig = {
  keys: {
    LocaleString: () => null,
    Slug: () => null,
    Image: () => null,
    SanityImageAsset: () => null,
    Color: () => null,
    BodyText: () => null,
  },
}

export const fetchOptionsExchange = (fn: any): Exchange => ({ forward }) => (
  ops$,
) => {
  return pipe(
    ops$,
    mergeMap((operation: Operation) => {
      const context = operation.context

      if (
        !context.role &&
        (operation.kind === 'mutation' || !operation.variables?.anonymous)
      ) {
        operation.context = {
          ...operation.context,
          role: 'user',
        }
      }

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
