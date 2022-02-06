import { MDXProvider } from '@mdx-js/react'
import { createContext, useContext } from 'react'

import { DocumentContent } from '~/component/documentContent'
import { DocumentFooter } from '~/component/documentFooter'
import { StoryContent } from '~/data/storyContent'

const StoryContext = createContext<StoryPageProps>(undefined as any)

export interface StoryPageProps {
  content: StoryContent
}

export default function StoryPage(props: StoryPageProps) {
  return (
    <StoryContext.Provider value={props}>
      <MDXProvider components={{ Title }}>
        <DocumentContent Component={props.content.Doc} />
        <DocumentFooter />
      </MDXProvider>
    </StoryContext.Provider>
  )
}

const Title = () => <>{useContext(StoryContext).content.meta.title}</>
