import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { DocumentNode } from 'graphql'
import { GraphQLClient } from 'graphql-request'

import { hasuraAdminSecret, hasuraGraphQLEndpoint } from '../config'

const client = new GraphQLClient(hasuraGraphQLEndpoint)

client.setHeader('x-hasura-admin-secret', hasuraAdminSecret)

type GqlFetchResult<TData = any> = {
  data?: TData
  errors?: Error[]
}

export function gqlFetch<TData = any, TVariables = Record<string, any>>(
  operation: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
): Promise<NonNullable<GqlFetchResult<TData>['data']>>
export function gqlFetch<TData = any, TVariables = Record<string, any>>(
  operation: DocumentNode,
  variables?: TVariables,
): Promise<NonNullable<GqlFetchResult<TData>['data']>> {
  console.log('fetching', hasuraGraphQLEndpoint, hasuraAdminSecret)
  return client.request(operation, variables)
}
