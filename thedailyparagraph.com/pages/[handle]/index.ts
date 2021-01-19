import { routeByPattern, routeLazy } from 'retil-router'

import { router as profileRouter } from 'src/routers/profile'
import { appRoutedPage } from 'src/utils/routing'

const router = routeByPattern({
  '/@:handle': profileRouter,

  // FIXME: why are these even needed? shouldn't the separate pages be called?!
  '/legal': routeLazy(() =>
    import('src/routers/legal').then(({ router }) => ({ default: router })),
  ),
  '/login': routeLazy(() =>
    import('src/routers/login').then(({ router }) => ({ default: router })),
  ),
  '/recover': routeLazy(() =>
    import('src/routers/recoverAccount').then(({ router }) => ({
      default: router,
    })),
  ),
})

export default appRoutedPage((req, res) =>
  router(
    {
      ...req,
      basename: '',
    },
    res,
  ),
)
