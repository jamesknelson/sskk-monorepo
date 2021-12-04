import { loadAsync } from 'retil-mount'
import { loadMatch, loadNotFoundBoundary } from 'retil-nav'
import { patternFor } from 'retil-url'

import { DocumentContent } from '../components/documentContent'

import examplePageLoader from './exampleLoader'
import exampleIndexLoader from './exampleIndexLoader'

import notFoundLoader from './notFoundLoader'

import appURLs from './appURLs'

const appLoader = loadNotFoundBoundary(
  loadMatch({
    [patternFor(appURLs.top)]: loadAsync(async () => {
      const { default: Component } = await import('../index.mdx')
      return <DocumentContent Component={Component} />
    }),

    [patternFor(appURLs.exampleIndex)]: exampleIndexLoader,
    [patternFor(appURLs.example)]: examplePageLoader,
  }),
  notFoundLoader,
)

export default appLoader
