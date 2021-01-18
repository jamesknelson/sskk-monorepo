import Head from 'next/head'
import React, { useMemo } from 'react'
import { css } from 'styled-components'

import { StoryCard } from 'src/components/story'
import { createStateFromContentObject } from 'src/editor/contentObject'
import { getTitle } from 'src/editor/getTitle'
import { renderJSONToReact } from 'src/editor/reactSerializer'
import { StoryQuery } from 'src/generated/graphql'
import { dimensions } from 'src/theme'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'

export interface Props {
  query: PrecachedQuery<StoryQuery>
}

export function Page(props: Props) {
  const { query } = props
  const { data } = usePrecachedQuery(query)
  const post = data.published_posts[0]
  const profile = post.profile!
  const editorState = useMemo(
    () => createStateFromContentObject(post.content),
    [post.content],
  )
  const title = getTitle(editorState)

  return (
    <>
      <Head>
        <title>
          {title || profile.display_name} &ndash; The Daily Paragraph
        </title>
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
        <StoryCard
          profileDisplayName={profile.display_name}
          profileHandle={profile.handle!}
          profileId={profile.id}
          publishedAt={new Date(post.published_at! + 'Z')}
          storyId={post.id}
          css={css`
            margin: 2rem 1rem;
            width: 100%;
          `}>
          {renderJSONToReact(editorState, {
            nodes: {
              title: () => (children: React.ReactNode) => (
                <h2
                  css={css`
                    margin: 2rem 0 1rem;
                  `}>
                  {children}
                </h2>
              ),
            },
          })}
        </StoryCard>
      </div>
    </>
  )
}
