import Head from 'next/head'
import * as React from 'react'
import { css } from 'styled-components'

import { StoryCard } from 'src/components/story'
import { createStateFromContentObject } from 'src/prose/contentObject'
import { ProfileByHandleQuery } from 'src/generated/graphql'
import { dimensions } from 'src/theme'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'

export interface Props {
  query: PrecachedQuery<ProfileByHandleQuery>
}

export function Page(props: Props) {
  const { query } = props
  const { data } = usePrecachedQuery(query)
  const profile = data.profiles[0]
  const posts = data.published_posts

  return (
    <>
      <Head>
        <title>{profile.display_name} &ndash; The Daily Paragraph</title>
        <meta
          name="description"
          content="A project to encourage ordinary people to write a couple sentences a day."
        />
      </Head>

      <>
        <h1
          css={css`
            font-size: 3.5rem;
            line-height: 3.5rem;
            text-align: center;
            margin: 5rem 1rem 3rem;
          `}>
          {profile.display_name}
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
          {posts.map((post) => (
            <StoryCard
              key={post.id!}
              editorState={createStateFromContentObject(post.content)}
              profileDisplayName={profile.display_name}
              profileHandle={profile.handle!}
              profileId={profile.id}
              publishedAt={new Date(post.published_at! + 'Z')}
              storyId={post.id}
              storySlug={post.slug}
              css={css`
                margin: 0.5rem 1rem;
                width: 100%;
              `}
            />
          ))}
        </div>
      </>
    </>
  )
}
