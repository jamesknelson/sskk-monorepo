import { loadMatch, loadNotFoundBoundary } from 'retil-nav'
import { patternFor } from 'retil-nav-scheme'

import storyPageLoader from './routes/storyLoader'
import storyIndexLoader from './routes/storyIndexLoader'

import notFoundLoader from './routes/notFoundLoader'
import topLoader from './routes/topLoader'

import app from './appScheme'

const appLoader = loadNotFoundBoundary(
  loadMatch({
    [patternFor(app.top)]: topLoader,
    [patternFor(app.storyIndex)]: storyIndexLoader,
    [patternFor(app.story)]: storyPageLoader,
  }),
  notFoundLoader,
)

export default appLoader
