import { routeAsync } from 'retil-router'

import { HomeDocument } from 'src/generated/graphql'
import { AppRequest } from 'src/utils/routing'

export const router = routeAsync(async (req: AppRequest) => {
  const pageModulePromise = import('./homePage')
  const query = req.createQuery(HomeDocument, {
    limit: 10,
  })

  await query.precache()

  const { Page } = await pageModulePromise

  return <Page query={query} />
})
