import { loadAsync } from 'retil-mount'
import { Env } from '~/env'

const storyIndexLoader = loadAsync<Env>(async (props) => {
  props.head.push(<title>stories</title>)
  const [{ default: data }, { default: Page }] = await Promise.all([
    import('~/data/storyIndex'),
    import('./storyIndexPage'),
  ])
  return <Page data={data} />
})

export default storyIndexLoader
