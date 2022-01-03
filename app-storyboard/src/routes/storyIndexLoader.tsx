import { loadAsync } from 'retil-mount'
import { AppEnv } from '~/appEnv'

const storyIndexLoader = loadAsync<AppEnv>(async (props) => {
  props.head.push(<title>stories</title>)
  const [{ default: data }, { default: Page }] = await Promise.all([
    import('~/data/storyIndex'),
    import('./storyIndexPage'),
  ])
  return <Page data={data} />
})

export default storyIndexLoader
