import { loadAsync } from 'retil-mount'
import { loadMatch, notFoundLoader } from 'retil-nav'

import { AppEnv } from 'src/env'
import { ProfileByHandleDocument } from 'src/generated/graphql'
import { patternFor } from 'src/utils/urls'

import urls, { ProfileParams } from './profileURLs'

const profileTopLoader = loadAsync<AppEnv<ProfileParams>>(async (env) => {
  const pageModulePromise = import('./profilePage')
  const query = await env.precacheQuery(ProfileByHandleDocument, {
    handle: env.nav.params.nametag,
    limit: 31,
  })

  const { Page } = await pageModulePromise

  const profile = query.data.profiles[0]
  if (!profile) {
    return notFoundLoader(env)
  }

  env.head.push(
    <title>{profile.display_name} &ndash; The Daily Paragraph</title>,
    <meta
      name="description"
      content="A project to encourage ordinary people to write a couple sentences a day."
    />,
  )

  return <Page query={query} />
})

const loader = loadMatch({
  [patternFor(urls.top)]: profileTopLoader,
})

export default loader
