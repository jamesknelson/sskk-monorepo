import { loadAsync } from 'retil-mount'

import { Env } from '~/env'
import { parseStoryDirnameParam } from '~/app/appScheme'
import { getStoryContent } from '~/data/storyContent'

const storyLoader = loadAsync<Env>(async (props) => {
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
