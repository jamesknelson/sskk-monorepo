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
  const handle = req.params.handle as string | undefined
  const slug = req.params.slug as string | undefined
  const maybeEncodedStoryId = req.params.storyId as string | undefined

  let query: PrecachedQuery<{ stories: StoryFieldsFragment[] }>

  try {
    if (maybeEncodedStoryId) {
      const storyId = decodeUUID(maybeEncodedStoryId)
      query = req.createQuery(
        StoryByIdDocument,
        { post_id: storyId },
        'anonymous',
      )
    } else if (handle && slug) {
      query = req.createQuery(
        StoryByHandleAndSlugDocument,
        { handle, slug },
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
  if (!story || (handle && story.profile?.handle !== handle)) {
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
