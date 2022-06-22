// import React from 'react'
import { css } from '@emotion/react'

// import { LetterCard } from 'src/components/letter'
// import { createStateFromContentObject } from 'src/prose/contentObject'
// import { ProfileByHandleQuery } from 'src/generated/graphql'
// import { PrecachedQuery, usePrecachedQuery } from 'src/utils/precachedQuery'

export interface Props {
  // query: PrecachedQuery<ProfileByHandleQuery>
}

export function Page(_props: Props) {
  // const { query } = props
  // const { data } = usePrecachedQuery(query)
  // const profile = data.profiles[0]
  // const posts = data.published_posts

  return (
    <>
      <h1
        css={css`
          font-size: 2.5rem;
          line-height: 2.5rem;
          text-align: center;
          margin: 3.5rem 1rem 2.5rem;
        `}>
        {/* {profile.display_name} */}
      </h1>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          width: calc(100% - 1rem);
          margin: 0 auto;
        `}>
        {/* {posts.map((post) => (
          <LetterCard
            key={post.id!}
            editorState={createStateFromContentObject(post.content)}
            profileAvatarURL={profile.avatar_url}
            profileDisplayName={profile.display_name}
            profileNametag={profile.handle!}
            publishedAt={new Date(post.published_at! + 'Z')}
            letterId={post.id}
            letterSlug={post.slug || undefined}
            css={css`
              margin: 0.5rem 1rem;
              width: 100%;
            `}
          />
        ))} */}
      </div>
    </>
  )
}