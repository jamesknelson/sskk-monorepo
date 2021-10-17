import { ApolloClient, InMemoryCache } from '@apollo/client'

import type { ReactElement } from 'react'
import type { HydrationEnv } from 'retil-hydration'
import { useEnv } from 'retil-mount'
import type { NavEnv, NavParams, NavQuery } from 'retil-nav'

import { AuthUser } from './auth'
import { CustomerDetails } from './customerDetails'

import { QueryPrecacher } from 'src/utils/precachedQuery'

export type AppApolloClient = ApolloClient<any>

export interface AppAuthUser extends Omit<AuthUser, 'id'> {
  memberId?: string
}

export interface DataEnv {
  cache?: InMemoryCache
  client: AppApolloClient
  precacheQuery: QueryPrecacher
  sessionId?: string | null
}

export interface AppMutablePersistedContext {
  transitionKey?: string
}

export interface AppEnv<
  Params extends NavParams = NavParams,
  Query extends NavQuery = NavQuery,
> extends DataEnv,
    HydrationEnv,
    NavEnv {
  head: ReactElement[]

  mutablePersistedContext: AppMutablePersistedContext

  nav: Omit<NavEnv['nav'], 'params' | 'query'> & {
    query: Query
    params: Params
  }

  authUser?: null | AppAuthUser
  customer?: null | CustomerDetails

  doNotTrack?: boolean
  hasHydrated: boolean
}

export function useAppEnv(): AppEnv {
  return useEnv<AppEnv>()
}
