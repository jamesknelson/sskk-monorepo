import Head from 'next/head'
import * as React from 'react'
import { css } from 'styled-components'

import { StoryCard } from 'src/components/story'
import { createStateFromContentObject } from 'src/editor/contentObject'
import { renderJSONToReact } from 'src/editor/reactSerializer'
import { HomeQuery } from 'src/generated/graphql'
import { dimensions } from 'src/theme'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'

export interface Props {
  query: PrecachedQuery<HomeQuery>
}

export function Page(props: Props) {
  const { query } = props
  const { data } = usePrecachedQuery(query)
  const posts = data.published_posts

  return (
    <>
      <Head>
        <title>The Daily Paragraph</title>
        <meta
          name="description"
          content="A project to encourage ordinary people to write a couple sentences a day."
        />
      </Head>

      <>
        <h1
          css={css`
            font-family: 'UnifrakturMaguntia', cursive;
            font-size: 3.5rem;
            line-height: 3.5rem;
            text-align: center;
            margin: 5rem 1rem 3rem;
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
          {posts.map((post) => {
            const profile = post.profile!

            return (
              <StoryCard
                key={post.id!}
                profileDisplayName={profile.display_name}
                profileHandle={profile.handle!}
                profileId={profile.id}
                publishedAt={new Date(post.published_at! + 'Z')}
                storyId={post.id}
                css={css`
                  margin: 0.5rem 1rem;
                  width: 100%;
                `}>
                {renderJSONToReact(createStateFromContentObject(post.content), {
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
            )
          })}
        </div>
      </>
    </>
  )
}
