import { routeAsync } from 'retil-router'

import { HomeDocument } from 'src/generated/graphql'
import { AppRequest } from 'src/utils/routing'

const layoutOptions = {
  scrollingHeader: {
    from: '0px',
    to: '64px',
  },
}

export const router = routeAsync(async (req: AppRequest) => {
  req.layoutOptions = layoutOptions

  const pageModulePromise = import('./homePage')
  const query = req.createQuery(HomeDocument, {
    limit: 10,
  })

  await query.precache()

  const { Page } = await pageModulePromise

  return <Page query={query} />
})
