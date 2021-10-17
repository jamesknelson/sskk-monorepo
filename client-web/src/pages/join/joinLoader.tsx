import { loadAsync } from 'retil-mount'
import { loadMatch } from 'retil-nav'

import { AppEnv } from 'src/env'
import { createHeadTags } from 'src/utils/createHeadTags'
import { patternFor } from 'src/utils/urls'

import Layout from './joinLayout'
import urls from './joinURLs'

const joinLoader = loadMatch<AppEnv>({
  // The top level loader is synchronous, so that it can be immediately
  // displayed when the user clicks through to the join flow, while
  // subsequent loaders are
  [patternFor(urls.top)]: loadAsync(async (env) => {
    const pageModule = await import('./1-joinTopPage')
    const { backgroundScene: background } = await import(
      './1-joinTopPage.background'
    )

    env.head.push(...createHeadTags(pageModule))

    env.mutablePersistedContext.transitionKey = '/join'

    return (
      <Layout backgroundScene={background} step={1}>
        <pageModule.Page />
      </Layout>
    )
  }),

  [patternFor(urls.writeIntroLetter)]: loadAsync(async (env) => {
    // TODO:
    // - save letter content to sessionStorage, and read from there
    // - if the user is logged in, read anything saved server-side,
    //   comparing the version with something in sessionStorage, and
    //   using whichever one is newer.
    // - show loading page before we read anything

    const pageModule = await import('./2-writeIntroLetterPage')
    const { backgroundScene } = await import(
      './2-writeIntroLetterPage.background'
    )

    env.head.push(...createHeadTags(pageModule))

    env.mutablePersistedContext.transitionKey = '/join'

    return (
      <Layout backgroundScene={backgroundScene} step={2}>
        <pageModule.Page />
      </Layout>
    )
  }),
})

export default joinLoader
