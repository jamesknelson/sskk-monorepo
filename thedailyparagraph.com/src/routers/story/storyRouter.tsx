import { routeAsync, routeByPattern, routeNotFound } from 'retil-router'

import { StoryDocument } from 'src/generated/graphql'
import { AppRequest } from 'src/utils/routing'
import { decodeUUID } from 'src/utils/uuid'

export const router = routeByPattern({
  '/:storyId': routeAsync(async (req: AppRequest, res) => {
    let storyId: string

    try {
      storyId = decodeUUID(req.params.storyId as string)
    } catch (error) {
      return routeNotFound()(req, res)
    }

    const pageModulePromise = import('./storyPage')
    const query = req.createQuery(
      StoryDocument,
      {
        handle: req.params.handle as string,
        post_id: storyId,
      },
      'anonymous',
    )

    const result = await query.precache()

    const story = result.published_posts[0]
    if (!story) {
      return routeNotFound()(req, res)
    }

    const { Page } = await pageModulePromise

    return <Page query={query} />
  }),
})
