import Head from 'next/head'
import { EditorState } from 'prosemirror-state'
import * as React from 'react'
import { css } from 'styled-components'

import { LinkButton } from 'src/components/button'
import { StoryCard } from 'src/components/story'
import { schema } from 'src/prose/schema'
import { DashboardPostListQuery } from 'src/generated/graphql'
import { colors, dimensions } from 'src/theme'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'

export interface Props {
  query: PrecachedQuery<DashboardPostListQuery>
}

export function Page(props: Props) {
  const { query } = props
  const { data } = usePrecachedQuery(query)
  const posts = data.posts

  return (
    <>
      <Head>
        <title>Your Stories &ndash; The Daily Paragraph</title>
      </Head>

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
            margin: 4rem 1rem 0;
            padding-bottom: 1rem;
            border-bottom: 1px solid ${colors.structure.border};
            width: 100%;
          `}>
          Your Stories
        </h1>
        <LinkButton
          css={css`
            margin: 2rem 0;
          `}
          outline
          to="./new">
          Start a story
        </LinkButton>
        {posts
          .filter((post) => !post.deleted_at)
          .map((post) => {
            const version = post.versions[0]!
            return (
              <StoryCard
                key={post.id}
                editorState={EditorState.fromJSON(
                  { schema },
                  version.editor_state,
                )}
                profileDisplayName={post.profile.display_name}
                profileHandle={post.profile.handle!}
                profileId={post.profile.id}
                publishedAt={
                  post.published_at && new Date(post.published_at + 'Z')
                }
                storyId={post.id}
                storySlug={version.slug}
                css={css`
                  margin: 0.5rem 1rem;
                  width: 100%;
                `}
              />
            )
          })}
      </div>
    </>
  )
}
