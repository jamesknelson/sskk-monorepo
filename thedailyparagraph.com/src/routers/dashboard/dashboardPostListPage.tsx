import { format } from 'date-fns'
import Head from 'next/head'
import * as React from 'react'
import { Link } from 'retil-router'

import { DashboardPostListQuery } from 'src/generated/graphql'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'
import { renderJSONToReact } from 'src/editor/reactSerializer'

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
        <title>Your posts</title>
      </Head>

      <>
        <h1>Your posts</h1>
        <p>
          <Link to="./new">Start writing</Link>
        </p>
        {posts.map((post) => {
          const version = post.versions[0]!
          return (
            <React.Fragment key={post.id}>
              <hr />
              <article>
                <header>
                  <h2>{version.title!}</h2>
                  <p>
                    {post.published_at && (
                      <>
                        <span>
                          {new Date(post.published_at) < new Date()
                            ? 'Published'
                            : 'Publishing'}{' '}
                          at {format(new Date(post.published_at), 'PPP')}
                        </span>
                        &nbsp;&middot;&nbsp;
                      </>
                    )}
                    <span>
                      Last updated at{' '}
                      <time dateTime={version.updated_at}>
                        {format(new Date(version.updated_at), 'PPP')}
                      </time>
                    </span>
                  </p>
                </header>
                {version.editor_state &&
                  renderJSONToReact(version.editor_state)}
                <footer>
                  <p>
                    <Link to={`./${post.id}`}>Edit &raquo;</Link>
                  </p>
                </footer>
              </article>
            </React.Fragment>
          )
        })}
      </>
    </>
  )
}
