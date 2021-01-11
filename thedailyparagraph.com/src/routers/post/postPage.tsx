import Head from 'next/head'
import * as React from 'react'

import { PostQuery } from 'src/generated/graphql'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'

export interface Props {
  query: PrecachedQuery<PostQuery>
}

export function Page(props: Props) {
  const { query } = props
  const { data } = usePrecachedQuery(query)
  const profile = data.profiles[0]
  const post = profile?.published_posts_by_slug?.[0]!

  return (
    <div className="container">
      <Head>
        <title>{post.title}</title>
      </Head>

      <main>
        <article>
          <h2>{post.title}</h2>
          {post.content}
        </article>
      </main>
    </div>
  )
}
