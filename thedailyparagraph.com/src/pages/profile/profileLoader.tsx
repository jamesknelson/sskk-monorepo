import { loadAsync } from 'retil-mount'
import { NotFoundError, loadMatch } from 'retil-nav'

import { AppEnv } from 'src/env'
import { ProfileByHandleDocument } from 'src/generated/graphql'
import { patternFor } from 'src/utils/urls'

import urls, { ProfileParams } from './profileURLs'

const profileTopLoader = loadAsync(async (env: AppEnv<ProfileParams>) => {
  const pageModulePromise = import('./profilePage')
  const query = await env.precacheQuery(ProfileByHandleDocument, {
    handle: env.nav.params.nametag,
    limit: 31,
  })

  const { Page } = await pageModulePromise

  const profile = query.data.profiles[0]
  if (!profile) {
    throw new NotFoundError(env.nav)
  }

  return <Page query={query} />
})

const loader = loadMatch({
  [patternFor(urls.top)]: profileTopLoader,
})

export default loader
