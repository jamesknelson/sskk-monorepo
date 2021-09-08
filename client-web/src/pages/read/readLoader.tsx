import { loadAsync } from 'retil-mount'

import { AppEnv } from 'src/env'
import { loadWithLayoutOptions } from 'src/env/routing'

const asyncRouter = loadAsync(async (env: AppEnv) => {
  const pageModulePromise = import('./readPage')

  const { Page } = await pageModulePromise

  env.head.push(
    <title>The Daily Paragraph</title>,
    <meta
      name="description"
      content="A project to encourage ordinary people to write a couple sentences a day."
    />,
  )

  return <Page />
})

const loader = loadWithLayoutOptions(asyncRouter, {
  scrollingHeader: {
    from: '0px',
    to: '64px',
  },
})

export default loader
