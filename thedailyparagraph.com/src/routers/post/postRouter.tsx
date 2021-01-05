import { routeAsync, routeNotFound } from 'retil-router'

import { PostDocument } from 'src/generated/graphql'
import { AppRequest } from 'src/utils/routing'

export const router = routeAsync(async (req: AppRequest, res) => {
  const pageModulePromise = import('./postPage')
  const query = req.createQuery(PostDocument, {
    handle: req.params.handle as string,
    slug: req.params.slug as string,
  })

  const result = await query.precache()

  const profile = result.profiles[0]
  const post = profile && profile.published_posts_by_slug![0]

  if (!post) {
    return routeNotFound()(req, res)
  }

  const { Page } = await pageModulePromise

  return <Page query={query} />
})
