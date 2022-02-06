import { InMemoryCache } from '@apollo/client'

import type { ReactElement } from 'react'
import type { HydrationEnv } from 'retil-hydration'
import { useMountEnv } from 'retil-mount'
import type { NavEnv, NavParams, NavQuery } from 'retil-nav'

import { AuthUser } from './auth'
import { CustomerIdentity } from './customerIdentity'

import { AppApolloClient } from '~/data/apollo'
import { QueryPrecacher } from '~/util/precachedQuery'

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

export interface Env<
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
  customerIdentity?: null | CustomerIdentity

  doNotTrack?: boolean
  hasHydrated: boolean
}

export function useEnv(): Env {
  return useMountEnv<Env>()
}
