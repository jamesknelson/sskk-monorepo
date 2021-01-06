import * as React from 'react'
import { routeAsync, routeByPattern, routeRedirect } from 'retil-router'

import {
  DashboardPostListDocument,
  DashboardPostEditorDocument,
} from 'src/generated/graphql'
import { AppRequest, requireAuth } from 'src/utils/routing'

export const router = requireAuth(
  routeByPattern({
    '/': routeRedirect('./posts'),
    '/posts': routeAsync(async (req: AppRequest) => {
      const pageModulePromise = import('./dashboardPostListPage')
      const query = req.createQuery(DashboardPostListDocument, {
        profile_id: req.profile!.id,
      })

      await query.precache()

      const { Page } = await pageModulePromise

      return <Page query={query} />
    }),
    '/posts/new': routeAsync(async () => {
      const pageModulePromise = import('./dashboardPostEditorPage')
      const { Page } = await pageModulePromise
      return <Page query={null} />
    }),
    '/posts/:postId': routeAsync(async (req: AppRequest) => {
      const pageModulePromise = import('./dashboardPostEditorPage')
      const query = req.createQuery(DashboardPostEditorDocument, {
        post_id: req.params.postId as string,
      })

      await query.precache()

      const { Page } = await pageModulePromise

      return <Page query={query} />
    }),
  }),
)
