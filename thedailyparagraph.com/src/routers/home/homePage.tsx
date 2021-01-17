import { format } from 'date-fns'
import Head from 'next/head'
import * as React from 'react'
import { css } from 'styled-components'

import { HomeQuery } from 'src/generated/graphql'
import { colors, dimensions, radii, shadows } from 'src/theme'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'
import { renderJSONToReact } from 'src/utils/prosemirrorReactSerializer'

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
      </Head>

      <main>
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
          `}>
          {posts.map((post) => {
            const profile = post.profile!

            return (
              <article
                key={post.id!}
                css={css`
                  background-color: ${colors.structure.bg};
                  border-bottom: 1px solid ${colors.structure.border};
                  box-shadow: ${shadows.card()};
                  border-radius: ${radii.small};

                  display: flex;
                  flex-direction: column;
                  margin: 0.5rem 1rem;
                  max-width: ${dimensions.largeCardWidth};
                  width: calc(100% - 1rem);
                  padding: 1rem 2rem;
                `}>
                <header
                  css={css`
                    padding-top: 0.5rem;
                  `}>
                  <div
                    css={css`
                      font-size: 0.9rem;
                      display: flex;
                      justify-content: space-between;
                      border-bottom: 1px solid ${colors.structure.border};
                      padding-bottom: 0.25rem;
                    `}>
                    <span>
                      <span
                        css={css`
                          font-weight: 700;
                        `}>
                        {profile.display_name!}
                      </span>
                      <span
                        css={css`
                          color: ${colors.text.tertiary};
                          margin: 0 0.375rem;
                        `}>
                        @{profile.handle}
                      </span>
                    </span>
                    <time
                      dateTime={post.published_at!}
                      css={css`
                        color: ${colors.text.tertiary};
                        margin-left: 0.375rem;
                      `}>
                      {format(new Date(post.published_at!), 'PPP')}
                    </time>
                  </div>
                  {post.title && (
                    <h2
                      css={css`
                        margin: 2rem 0 0rem;
                      `}>
                      {post.title}
                    </h2>
                  )}
                </header>
                <div>
                  {renderJSONToReact({
                    doc: post.content,
                    selection: { head: 0, anchor: 0, type: 'text' },
                  })}
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </>
  )
}
