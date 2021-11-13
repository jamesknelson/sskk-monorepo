import {
  ApolloClient,
  FetchPolicy,
  gql,
  QueryResult,
  useQuery,
} from '@apollo/client'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import { useMemo } from 'react'

import { Role } from 'src/types/roles'

export interface QueryContext {
  role?: Role
  suspense?: false
}

export interface PrecachedQuery<Data, Variables extends object = object> {
  client: ApolloClient<any>
  document: DocumentNode<Data, Variables>
  context: QueryContext
  variables: Variables

  data: Data
}

export type UsePrecachedQueryResponse<
  Data = any,
  Variables = object,
> = QueryResult<Data, Variables> & {
  // Remove possibility of `undefined`
  data: Data
}

export interface UsePrecachedQueryArgs<Variables extends object = object> {
  variables?: Variables
  requestPolicy?: FetchPolicy
  pollInterval?: number
  context?: QueryContext
  pause?: boolean
}

const emptyQuery = gql`
  query Empty {
    void
  }
`

export type QueryPrecacher = <Result, Variables extends object>(
  node: DocumentNode<Result, Variables>,
  variables?: Variables,
  context?: QueryContext,
) => Promise<PrecachedQuery<Result, Variables>>

export function usePrecachedQuery<
  Result = any,
  Variables extends object = object,
>(
  query: null | PrecachedQuery<Result, Variables>,
  args: UsePrecachedQueryArgs<Variables> = {},
): UsePrecachedQueryResponse<Result, Variables> {
  const context = useMemo(
    () => ({ ...args?.context, ...query?.context, suspense: false }),
    [args?.context, query?.context],
  )

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

  return result as UsePrecachedQueryResponse<Result, Variables>
}
