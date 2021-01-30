import { routeAsync } from 'retil-router'

import { HomeDocument } from 'src/generated/graphql'
import { AppRequest, routeWithLayoutOptions } from 'src/utils/routing'

const asyncRouter = routeAsync(async (req: AppRequest) => {
  const pageModulePromise = import('./homePage')
  const query = req.createQuery(HomeDocument, {
    limit: 10,
  })

  await query.precache()

  const { Page } = await pageModulePromise

  return <Page query={query} />
})

export const router = routeWithLayoutOptions(asyncRouter, {
  scrollingHeader: {
    from: '0px',
    to: '64px',
  },
})
