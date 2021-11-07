import { format } from 'date-fns'
import { css } from '@emotion/react'
import { useState } from 'react'

import { paletteColors } from 'src/presentation/colors'
import { largeCardClampWidth } from 'src/presentation/dimensions'
import { Card } from 'src/presentation/card'
import { TextBlock } from 'src/presentation/blocks'

// import { LetterCard } from 'src/components/letter'
// import { createStateFromContentObject } from 'src/prose/contentObject'
// import { HelloQuery } from 'src/generated/graphql'
// import { PrecachedQuery, usePrecachedQuery } from 'src/utils/precachedQuery'

import { SpringTrailColumn } from 'src/presentation/springTrailColumn'
import { useOverrideColumnTransitionHandleRef } from 'src/components/columnTransition'

export interface Props {
  // query: PrecachedQuery<HelloQuery>
}

export function Page(_props: Props) {
  const transitionHandleRef = useOverrideColumnTransitionHandleRef()
  const [date] = useState(new Date())

  // const { query } = props
  // const { data } = usePrecachedQuery(query)
  // const posts = data.published_posts

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: ${largeCardClampWidth};
        width: 100%;
        margin: 0 auto;
        padding: 0 0.5rem;
        z-index: 1;
      `}>
      <SpringTrailColumn transitionHandleRef={transitionHandleRef}>
        <h1
          css={css`
            color: ${paletteColors.ink900};
            font-family: Chomsky, sans-serif;
            font-size: 3.5rem;
            line-height: 3.5rem;
            text-align: center;
            margin: 3.5rem 1rem 1.5rem;
          `}>
          The Daily Letterhouse
        </h1>
        <div
          css={css`
            display: flex;
            justify-content: space-between;

            margin-bottom: 0.5rem;

            color: ${paletteColors.ink500};
            font-family: sans-serif;
            font-size: 0.9rem;
          `}>
          <div>{format(date, 'do MMMM, yyyy')}</div>
          <div>Morning edition</div>
        </div>
        <Card radius="0">
          <div
            css={css`
              padding: 2rem 0;
            `}>
            <TextBlock>
              <h1>This is a public service announcment.</h1>
              <p>You should totes join Letterhouse.</p>
            </TextBlock>
          </div>
        </Card>
        {/* {posts.map((post) => {
          const profile = post.profile!

          return (
            <LetterCard
              key={post.id!}
              editorState={createStateFromContentObject(post.content)}
              profileAvatarURL={profile.avatar_url}
              profileDisplayName={profile.display_name}
              profileNametag={profile.handle!}
              publishedAt={new Date(post.published_at! + 'Z')}
              letterId={post.id}
              letterSlug={post.slug!}
              css={css`
                margin: 0.5rem 1rem;
                width: 100%;
              `}
            />
          )
        })} */}
      </SpringTrailColumn>
    </div>
  )
}
