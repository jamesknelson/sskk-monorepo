import { routeAsync, routeNotFound } from 'retil-router'

import { ProfileByHandleDocument } from 'src/generated/graphql'
import { AppRequest } from 'src/utils/routing'

export const router = routeAsync(async (req: AppRequest, res) => {
  const pageModulePromise = import('./profilePage')
  const query = req.createQuery(ProfileByHandleDocument, {
    handle: req.params.handle as string,
    limit: 10,
  })

  await query.precache()

  const { Page } = await pageModulePromise

  const result = await query.precache()

  const profile = result.profiles[0]
  if (!profile) {
    return routeNotFound()(req, res)
  }

  return <Page query={query} />
})
