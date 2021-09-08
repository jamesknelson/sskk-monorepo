// import { EditorState } from 'prosemirror-state'
import { css } from '@emotion/react'

// import { LetterCard } from 'src/components/letter'
// import { DashboardPostListQuery } from 'src/generated/graphql'
// import { schema } from 'src/prose/schema'
import { dimensions } from 'src/theme'
// import { PrecachedQuery, usePrecachedQuery } from 'src/utils/precachedQuery'

export interface Props {
  // query: PrecachedQuery<DashboardPostListQuery>
}

export function Page(_props: Props) {
  // const { query } = props
  // const { data } = usePrecachedQuery(query)
  // const posts = data.posts

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: ${dimensions.largeCardWidth};
        width: calc(100% - 1rem);
        margin: 0 auto;
      `}>
      <h1
        css={css`
          font-size: 2rem;
          line-height: 2rem;
          text-align: center;
          margin: 3rem 1rem 1.5rem;
          padding-bottom: 1rem;
          width: 100%;
        `}>
        Your Stories
      </h1>
      {/* {posts
        .filter((post) => !post.deleted_at)
        .map((post) => {
          const version = post.versions[0]!
          return (
            <LetterCard
              key={post.id}
              editorState={EditorState.fromJSON(
                { schema },
                version.editor_state,
              )}
              profileAvatarURL={post.profile.avatar_url}
              profileDisplayName={post.profile.display_name}
              profileNametag={post.profile.handle!}
              profileId={post.profile.id}
              publishedAt={
                post.published_at && new Date(post.published_at + 'Z')
              }
              letterId={post.id}
              letterSlug={version.slug || undefined}
              css={css`
                margin: 0.5rem 1rem;
                width: 100%;
              `}
            />
          )
        })} */}
    </div>
  )
}
