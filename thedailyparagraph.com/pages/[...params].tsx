import { routeByPattern, routeLazy } from 'retil-router'

import { appRoutedPage } from 'src/utils/routing'
import { router as storyRouter } from 'src/routers/story'

const router = routeByPattern({
  '/@:handle*': storyRouter,

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

export default appRoutedPage((req, res) => {
  return router(
    {
      ...req,
      // Somehow the wildcard gets into the basename on this route
      basename: req.basename.replace('/[...params]', ''),
    },
    res,
  )
})
