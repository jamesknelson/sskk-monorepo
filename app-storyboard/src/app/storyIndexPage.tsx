import app from '~/app/appScheme'
import {
  DocLink,
  DocTitle,
  DocUnorderedList,
  DocWrapper,
} from '~/component/documentStyles'
import { StoryMeta } from '~/data/storyMeta'

interface Props {
  data: StoryMeta[]
}

function Page(props: Props) {
  const { data } = props

  return (
    <DocWrapper>
      <DocTitle>Examples</DocTitle>
      <DocUnorderedList>
        {data.map((storyModule) => (
          <li key={storyModule.key}>
            <DocLink href={app.story(storyModule)}>{storyModule.title}</DocLink>
          </li>
        ))}
      </DocUnorderedList>
    </DocWrapper>
  )
}

export default Page
