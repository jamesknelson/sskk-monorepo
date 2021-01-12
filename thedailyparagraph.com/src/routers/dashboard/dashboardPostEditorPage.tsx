import { useMutation } from '@apollo/client'
import { formatDistance, formatISO } from 'date-fns'
import startOfTomorrow from 'date-fns/startOfTomorrow'
import Head from 'next/head'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useOperation } from 'retil-operation'
import { joinPaths, useNavigate } from 'retil-router'
import slugify from 'slugify'

import {
  Editor,
  serializeContent,
  serializeEditorState,
  useEditorState,
} from 'src/components/editor'
import { Input } from 'src/components/input'
import {
  DashboardPostEditorQuery,
  CreatePostDocument,
  SavePostDraftDocument,
  PublishPostDocument,
} from 'src/generated/graphql'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'
import { useAppRequest } from 'src/utils/routing'

export interface Props {
  query: null | PrecachedQuery<DashboardPostEditorQuery>
}

export function Page({ query }: Props) {
  const request = useAppRequest()
  const navigate = useNavigate()
  const { data } = usePrecachedQuery(query)
  const post = data
    ? data.post!
    : {
        id: undefined,
        versions: [],
        published_at: null,
        updated_at: null,
        deleted_at: null,
      }
  const version = post.versions[0]

  const [title, setTitle] = useState(version?.title || '')
  const [slug, setSlug] = useState(version?.slug || '')
  const [editorState, setEditorState] = useEditorState(version?.editor_state)

  const placeholderSlug = slugify(title, {
    lower: true,
    strict: true,
  })

  const [executeCreate] = useMutation(CreatePostDocument, {
    context: {
      role: 'editor',
    },
  })
  const [executeSave] = useMutation(SavePostDraftDocument, {
    context: {
      role: 'editor',
    },
  })

  const [doSubmit, submitPending] = useOperation(
    async (event: React.FormEvent) => {
      event.preventDefault()

      const version = {
        title: title || null,
        slug: slug || placeholderSlug || null,
        editor_state: serializeEditorState(editorState),
        content: serializeContent(editorState),
      }

      if (!query) {
        const result = await executeCreate({
          variables: {
            profile_id: request.profile!.id,
            version,
          },
        })
        const insertedId = result.data?.insert_posts_one?.id
        if (insertedId) {
          await navigate(joinPaths(request.pathname, '..', insertedId))
        } else {
          alert("Couldn't save")
        }
      } else {
        const result = await executeSave({
          variables: {
            version: {
              post_id: post.id,
              ...version,
            },
          },
        })
        if (result.errors) {
          alert("Couldn't save")
        }
      }
    },
  )

  const [baseDate, setBaseDate] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setBaseDate(new Date())
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{title ? `Edit "${title}"` : 'New post'}</title>
      </Head>

      <form onSubmit={doSubmit}>
        <p>
          {version ? (
            <>
              Last saved{' '}
              <span>
                {formatDistance(new Date(version.updated_at + 'Z'), baseDate)}
              </span>{' '}
              ago
            </>
          ) : (
            'Not yet saved'
          )}
          <br />
        </p>

        <Input type="text" value={title} onChange={setTitle} />
        <br />
        <Input
          type="text"
          placeholder={placeholderSlug}
          value={slug}
          onChange={setSlug}
        />
        <br />
        <Editor state={editorState} onChange={setEditorState} />
        <br />
        <button disabled={submitPending} type="submit">
          {submitPending ? 'Saving...' : 'Save'}
        </button>
        {post.id && (
          <PublishButton postId={post.id} publishedAt={post.published_at} />
        )}
      </form>
    </>
  )
}

interface PublishButtonProps {
  postId: string
  publishedAt?: string | null
}

function PublishButton(props: PublishButtonProps) {
  const [executePublish] = useMutation(PublishPostDocument, {
    context: {
      role: 'editor',
    },
  })

  const [publishedAt, setPublishedAt] = useState(
    props.publishedAt ||
      formatISO(startOfTomorrow(), {
        representation: 'date',
      }),
  )

  const [doPublish, publishPending] = useOperation(
    async (event: React.MouseEvent) => {
      event.preventDefault()

      const result = await executePublish({
        variables: {
          post_id: props.postId,
          published_at: publishedAt,
        },
      })

      if (result.errors) {
        alert("Couldn't publish")
      }
    },
  )

  return (
    <>
      <button type="button" onClick={doPublish}>
        {publishPending ? 'Publishing' : 'Publish'}
        {props.publishedAt && ' update'}
      </button>
      {!props.publishedAt && (
        <>
          <Input type="text" value={publishedAt} onChange={setPublishedAt} />
        </>
      )}
    </>
  )
}
