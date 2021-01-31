import { routeByPattern } from 'retil-router'

import { router as storyRouter } from 'src/routers/story'
import { appRoutedPage } from 'src/utils/routing'

const router = routeByPattern({
  '/@:handle/~:storyId': storyRouter,
  '/@:handle/:slug': storyRouter,
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
