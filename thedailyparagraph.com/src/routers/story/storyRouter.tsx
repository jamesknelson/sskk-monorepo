import { routeAsync, routeNotFound, routeRedirect } from 'retil-router'

import {
  StoryByIdDocument,
  StoryByHandleAndSlugDocument,
  StoryFieldsFragment,
} from 'src/generated/graphql'
import { PrecachedQuery } from 'src/utils/graphql'
import { AppRequest, getStoryPath } from 'src/utils/routing'
import { decodeUUID } from 'src/utils/uuid'

export const router = routeAsync(async (req: AppRequest, res) => {
  let query: PrecachedQuery<{ stories: StoryFieldsFragment[] }>

  try {
    if (req.params.storyId) {
      const storyId = decodeUUID(req.params.storyId as string)
      query = req.createQuery(
        StoryByIdDocument,
        {
          post_id: storyId,
        },
        'anonymous',
      )
    } else if (req.params.handle && req.params.slug) {
      query = req.createQuery(
        StoryByHandleAndSlugDocument,
        {
          handle: req.params.handle as string,
          slug: req.params.slug as string,
        },
        'anonymous',
      )
    } else {
      throw new Error('Missing parameters')
    }
  } catch (error) {
    return routeNotFound()(req, res)
  }

  const pageModulePromise = import('./storyPage')
  const result = await query.precache()

  const story = result.stories[0]
  if (!story) {
    return routeNotFound()(req, res)
  }

  const publishedAt = new Date(story.published_at! + 'Z')
  const path = getStoryPath({
    profileId: story.profile!.id,
    profileHandle: story.profile!.handle,
    publishedAt,
    storyId: story.id,
    storySlug: story.slug,
  })

  if (path !== req.pathname) {
    return routeRedirect(path)(req, res)
  }

  const { Page } = await pageModulePromise

  return <Page query={query} />
})
