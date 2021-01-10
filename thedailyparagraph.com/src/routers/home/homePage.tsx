import { format } from 'date-fns'
import Head from 'next/head'
import * as React from 'react'

import { HomeQuery } from 'src/generated/graphql'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'

export interface Props {
  query: PrecachedQuery<HomeQuery>
}

export function Page(props: Props) {
  const { query } = props
  const [{ data }] = usePrecachedQuery({ query })
  const posts = data.published_posts

  return (
    <>
      <Head>
        <title>The Daily Paragraph</title>
      </Head>

      <main>
        <h1>The Daily Paragraph</h1>
        <div>
          {posts.map((post) => {
            const profile = post.profile!

            return (
              <article key={post.id!}>
                <h2>{post.title!}</h2>
                <span>
                  Published by {profile.display_name!} (@{profile.handle}) on{' '}
                  <time dateTime={post.published_at!}>
                    {format(new Date(post.published_at!), 'PPP')}
                  </time>
                </span>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>
            )
          })}
        </div>
      </main>
    </>
  )
}
