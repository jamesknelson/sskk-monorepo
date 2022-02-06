import { loadAsync } from 'retil-mount'

import { Env } from '~/env'

export default loadAsync(async (env: Env) => {
  const pageModulePromise = import('./frontPage')
  // const query = await env.precacheQuery(HelloDocument, {
  //   limit: 10,
  // })

  const { Page } = await pageModulePromise

  env.head.push(
    <title>The Daily Letterhouse</title>,
    <meta
      name="description"
      content="A project to encourage ordinary people to write a couple sentences a day."
    />,
  )

  return <Page />
})
