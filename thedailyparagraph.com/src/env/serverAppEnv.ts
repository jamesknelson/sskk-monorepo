import { ApolloClient, InMemoryCache } from '@apollo/client'
import type { Request, Response } from 'express'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import type { ReactElement } from 'react'
import { createServerNavEnv } from 'retil-nav'

import { graphqlURL } from 'src/config'
import { PrecachedQuery } from 'src/utils/precachedQuery'

import { AppEnv } from './appEnv'

export function createServerAppEnv(
  request: Omit<Request, 'params' | 'query'>,
  response: Response,
): AppEnv {
  const cache = new InMemoryCache()
  const client = new ApolloClient({
    uri: graphqlURL,
    cache,
  })

  const precacheQuery = async <Result = any, Variables extends object = object>(
    document: DocumentNode<Result, Variables>,
    defaultVariables: Variables = {} as Variables,
    role?: string,
  ): Promise<PrecachedQuery<Result, Variables>> => {
    const result = await client.query({
      query: document,
      variables: defaultVariables,
      context: {
        role,
      },
    })

    if (result.errors) {
      throw result
    }

    return {
      client,
      document,
      data: result.data,
      role,
      variables: defaultVariables!,
    }
  }

  const env: AppEnv = {
    ...createServerNavEnv(request, response),
    authUser: undefined,
    cache,
    client,
    hasHydrated: false,
    head: [] as ReactElement[],
    layoutOptions: {},
    precacheQuery,
    profile: undefined,
  }

  return env
}
