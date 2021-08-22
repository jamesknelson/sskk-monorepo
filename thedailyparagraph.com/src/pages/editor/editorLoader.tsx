import React from 'react'
import { loadAsync } from 'retil-mount'
import { NotFoundError, loadMatch, loadRedirect } from 'retil-nav'

import { loadAuthenticated } from 'src/env/routing'
import {
  DashboardPostListDocument,
  DashboardPostEditorDocument,
} from 'src/generated/graphql'
import { decodeUUID } from 'src/utils/uuid'

export const router = loadAuthenticated(
  loadMatch({
    '/': loadMatch('./stories'),
    '/stories': routeAsync(async (req) => {
      const pageModulePromise = import('./dashboardPostListPage')
      const query = req.createQuery(
        DashboardPostListDocument,
        {
          profile_id: req.profile!.id,
        },
        'editor',
      )

      await query.precache()

      const { Page } = await pageModulePromise

      return <Page query={query} />
    }),
    '/stories/new': routeAsync(async (req) => {
      const pageModulePromise = import('./dashboardPostEditorPage')
      const query = req.createQuery(
        DashboardPostEditorDocument,
        {
          is_new: true,
        },
        'editor',
      )

      await query.precache()

      const { Page } = await pageModulePromise

      return <Page query={query} />
    }),
    '/story/:storyId': routeAsync(async (req, res) => {
      let storyId: string
      try {
        storyId = decodeUUID(req.params.storyId as string)
      } catch (error) {
        return routeNotFound()(req, res)
      }

      const pageModulePromise = import('./dashboardPostEditorPage')
      const query = req.createQuery(
        DashboardPostEditorDocument,
        {
          post_id: storyId as string,
        },
        'editor',
      )

      const { post } = await query.precache()

      if (!post) {
        return routeNotFound()(req, res)
      }

      const { Page } = await pageModulePromise

      return <Page query={query} />
    }),
  }),
)
