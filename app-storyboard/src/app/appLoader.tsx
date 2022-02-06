import { loadMatch, loadNotFoundBoundary } from 'retil-nav'
import { patternFor } from 'retil-nav-scheme'

import storyPageLoader from './storyLoader'
import storyIndexLoader from './storyIndexLoader'

import notFoundLoader from './notFoundLoader'
import topLoader from './topLoader'

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
