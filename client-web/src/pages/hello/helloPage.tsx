import { css } from '@emotion/react'

// import { LetterCard } from 'src/components/letter'
// import { createStateFromContentObject } from 'src/prose/contentObject'
// import { HelloQuery } from 'src/generated/graphql'
import { dimensions, media } from 'src/theme'
// import { PrecachedQuery, usePrecachedQuery } from 'src/utils/precachedQuery'

export interface Props {
  // query: PrecachedQuery<HelloQuery>
}

export function Page(_props: Props) {
  // const { query } = props
  // const { data } = usePrecachedQuery(query)
  // const posts = data.published_posts

  return (
    <>
      <h1
        css={css`
          font-family: 'chomskyregular', sans-serif;
          font-size: 3.5rem;
          line-height: 3.5rem;
          text-align: center;
          margin: 1.5rem 1rem 3rem;

          ${media.phoneOnly`
              font-size: 2rem;
              line-height: 1.5rem;
              margin: 2.5rem 1rem 2.5rem;
            `}
        `}>
        The Daily Paragraph
      </h1>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: ${dimensions.largeCardWidth};
          width: calc(100% - 1rem);
          margin: 0 auto;
        `}>
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
      </div>
    </>
  )
}