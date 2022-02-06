import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'
import type { Request, Response } from 'express'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import type { ReactElement } from 'react'
import { createServerNavEnv } from 'retil-nav'

import { graphqlURL } from '~/config'
import { QueryContext, PrecachedQuery } from '~/util/precachedQuery'

import { Env } from './env'

export function createServerAppEnv(
  request: Omit<Request, 'params' | 'query'>,
  response: Response,
): Env {
  const cache = new InMemoryCache()
  const httpLink = new HttpLink({
    fetch,
    uri: graphqlURL,
    headers: {
      'x-sskk-ssr': process.env.SSR_SECRET,
    },
  })
  const client = new ApolloClient({
    uri: graphqlURL,
    cache,
    link: httpLink,
  })

  const precacheQuery = async <Result = any, Variables extends object = object>(
    document: DocumentNode<Result, Variables>,
    defaultVariables: Variables = {} as Variables,
    context: QueryContext = {},
  ): Promise<PrecachedQuery<Result, Variables>> => {
    const result = await client.query({
      query: document,
      variables: defaultVariables,
      context,
    })

    if (result.errors) {
      throw result
    }

    return {
      client,
      document,
      data: result.data,
      context,
      variables: defaultVariables!,
    }
  }

  const env: Env = {
    ...createServerNavEnv(request, response),
    authUser: undefined,
    cache,
    client,
    customerIdentity: undefined,
    hasHydrated: false,
    head: [] as ReactElement[],
    mutablePersistedContext: {},
    precacheQuery,
  }

  return env
}
