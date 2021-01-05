import * as React from 'react'

import { routeAsync } from 'retil-router'

import { AppRequest, requireAuth } from 'src/utils/routing'

export const router = requireAuth(
  routeAsync(async (_req: AppRequest) => {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    )
  }),
)
