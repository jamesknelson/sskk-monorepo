import { loadAsync } from 'retil-mount'

import { AppEnv } from '~/appEnv'
import { parseStoryDirnameParam } from '~/appScheme'
import { getStoryContent } from '~/data/storyContent'

const storyLoader = loadAsync<AppEnv>(async (props) => {
  const { mount, head, ...env } = props
  const params = env.nav.params
  const dirname = parseStoryDirnameParam(params.dirname as string)
  const filename = params.filename as string
  const pageModule = import('./storyPage')
  const content = await getStoryContent(dirname, filename)

  if (!content) {
    return props.nav.notFound()
  }

  head.push(<title>Stories: {content.meta.title}</title>)

  const { default: StoryPage } = await pageModule

  return <StoryPage content={content} />
})

export default storyLoader
