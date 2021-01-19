import { useMutation } from '@apollo/client'
import { formatISO } from 'date-fns'
import Head from 'next/head'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useOperation } from 'retil-operation'
import { joinPaths, useNavigate } from 'retil-router'
import slugify from 'slugify'
import styled, { css } from 'styled-components'

import { Button } from 'src/components/button'
import { Card } from 'src/components/card/card'
import { StoryCard } from 'src/components/story'
import { Edit, Message, Trash, X } from 'src/constants/glyphs'
import {
  Editor,
  getTitle,
  serializeToContentObject,
  useEditorState,
} from 'src/prose'
import {
  DashboardPostEditorQuery,
  CancelPostPublishDocument,
  CreatePostDocument,
  DeletePostDocument,
  SavePostDraftDocument,
  PublishPostDocument,
} from 'src/generated/graphql'
import { colors, dimensions } from 'src/theme'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'
import { useAppRequest } from 'src/utils/routing'

export interface Props {
  query: null | PrecachedQuery<DashboardPostEditorQuery>
}

const lengthOfOneDay = 60 * 60 * 24 * 1000

function getStartOfUTCDay(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function isTimeInUTCDay(x: number, y: number): boolean {
  const startOfDay = getStartOfUTCDay(new Date(y))
  return x >= startOfDay && x < startOfDay + lengthOfOneDay
}

// Find the beginning of the next UTC day when nothing is scheduled to be
// published.
function getNextAvailableDate(publishTimes: number[]): Date {
  const startOfUTCTomorrow = getStartOfUTCDay(new Date()) + lengthOfOneDay
  const takenTimes = publishTimes
    .filter((time) => time >= startOfUTCTomorrow)
    .sort()
  let attempt = startOfUTCTomorrow
  while (takenTimes.length && isTimeInUTCDay(attempt, takenTimes[0])) {
    takenTimes.shift()
    attempt += lengthOfOneDay
  }
  return new Date(attempt)
}

export function Page({ query }: Props) {
  const request = useAppRequest()
  const profile = request.profile!
  const navigate = useNavigate()
  const { data } = usePrecachedQuery(query)
  const post = data?.post || {
    id: undefined,
    versions: [],
    published_at: null,
    updated_at: null,
    deleted_at: null,
  }
  const version = post.versions[0]

  const [editorState, applyEditorTransaction] = useEditorState(
    version?.editor_state,
  )

  const [lastSavedDoc, setLastSavedDoc] = useState(editorState.doc)

  const title = getTitle(editorState)
  const slug = slugify(title || '', {
    lower: true,
    strict: true,
  })

  const isEmpty = !editorState.doc.textContent

  const publishedAt = post.published_at && new Date(post.published_at + 'Z')

  const queuedPublishTimes = (data.queued_posts || [])
    .filter((post) => post.published_at)
    .map((post) => new Date(post.published_at! + 'Z').getTime())

  const [publishAt] = useState(
    post.published_at ||
      formatISO(getNextAvailableDate(queuedPublishTimes), {
        representation: 'date',
      }),
  )

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
  const [doSave, savePending] = useOperation(async () => {
    const version = {
      slug: slug || null,
      editor_state: editorState.toJSON(),
      content: serializeToContentObject(editorState),
    }

    if (!post.id) {
      try {
        const result = await executeCreate({
          variables: {
            profile_id: request.profile!.id,
            version,
          },
        })
        const insertedId = result.data?.insert_posts_one?.id
        if (insertedId) {
          await navigate(
            joinPaths(request.pathname, '..', '..', 'story', insertedId),
          )
        } else {
          alert("Couldn't save")
          return
        }
      } catch (error) {
        alert("Couldn't save")
        return
      }
    } else {
      try {
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
          return
        }
      } catch (error) {
        alert("Couldn't save")
        return
      }
    }

    setLastSavedDoc(editorState.doc)
  })

  const [executePublish] = useMutation(PublishPostDocument, {
    context: {
      role: 'editor',
    },
  })
  const [doPublish, publishPending] = useOperation(async (_event: any) => {
    // If we have any unsaved changes, then save them first
    if (canSave) {
      await doSave()
    }

    try {
      await executePublish({
        variables: {
          post_id: post.id,
          post: post.published_at ? {} : { published_at: publishAt },
        },
      })
    } catch (error) {
      alert("Couldn't publish")
    }
  })

  const [executeCancel] = useMutation(CancelPostPublishDocument, {
    context: {
      role: 'editor',
    },
  })
  const [doCancel, cancelPending] = useOperation(async (_event: any) => {
    try {
      await executeCancel({
        variables: {
          post_id: post.id,
        },
      })
    } catch (error) {
      alert("Couldn't cancel")
    }
  })

  const [executeDelete] = useMutation(DeletePostDocument, {
    context: {
      role: 'editor',
    },
  })
  const [doDelete, deletePending] = useOperation(async (_event: any) => {
    if (window.confirm('You sure want to delete this?')) {
      try {
        await executeDelete({
          variables: {
            post_id: post.id,
          },
        })
        await navigate(joinPaths(request.pathname, '..', '..', 'stories'))
      } catch (error) {
        alert("Couldn't delete")
      }
    }
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    doSave()
  }

  const canCancel = !cancelPending && publishedAt && publishedAt > new Date()
  const canDelete = !deletePending && !!post.id
  const canSave = !savePending && !isEmpty && lastSavedDoc !== editorState.doc
  const canPublish =
    !publishPending &&
    (canSave ||
      (!canSave &&
        !savePending &&
        !isEmpty &&
        version &&
        (!version.locked_for_publication || !post.published_at)))

  // Put this in an effect to prevent blocking update.
  // TODO: throttle this
  useEffect(() => {
    if (editorState.doc.eq(lastSavedDoc)) {
      setLastSavedDoc(editorState.doc)
    }
  }, [editorState.doc])

  return (
    <>
      <Head>
        <title>
          {post.id ? `Edit ${title ? `"${title}"` : 'story'}` : 'New story'}
        </title>
      </Head>

      <form
        onSubmit={handleSubmit}
        css={css`
          margin: 0.5rem auto;
          max-width: ${dimensions.largeCardWidth};
          width: calc(100% - 1rem);
        `}>
        <Card
          css={css`
            height: 48px;
          `}
        />
        <StoryCard
          disableEdit
          profileDisplayName={profile.displayName}
          profileId={profile.id}
          profileHandle={profile.handle!}
          publishedAt={publishedAt}
          storyId={post.id}
          storySlug={version?.slug}
          css={css`
            margin: 0.25rem 0;

            .ProseMirror-menubar {
              position: absolute;
              margin-top: -93px;
              border-bottom: none;
              padding: 0 1.75rem;
            }
          `}>
          {isEmpty && (
            <div
              css={css`
                position: absolute;
                left: 2rem;
                top: 1rem;
                color: ${colors.ink.light};
              `}>
              Your story...
            </div>
          )}
          <Editor
            state={editorState}
            applyTransaction={applyEditorTransaction}
            minHeight="80px"
          />
        </StoryCard>
        <Card as="footer">
          <FooterLayout>
            <FooterGroup>
              <Button
                busy={publishPending}
                disabled={!canPublish}
                glyph={Message}
                type="button"
                onClick={doPublish}>
                {publishedAt ? 'Amend' : 'Publish'}
              </Button>
              <Button
                busy={!publishPending && savePending}
                disabled={!canSave}
                glyph={Edit}
                type="submit"
                outline
                css={css`
                  margin-left: 0.5rem;
                `}>
                Save draft
              </Button>
            </FooterGroup>
            <FooterGroup>
              {canCancel ? (
                <Button
                  busy={cancelPending}
                  disabled={!canCancel}
                  glyph={X}
                  onClick={doCancel}
                  outline>
                  Cancel
                </Button>
              ) : (
                <Button
                  busy={deletePending}
                  disabled={!canDelete}
                  glyph={Trash}
                  onClick={doDelete}
                  outline>
                  Delete
                </Button>
              )}
            </FooterGroup>
          </FooterLayout>
        </Card>
      </form>
    </>
  )
}

const FooterLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.75rem 2rem;
  z-index: 1;
`

const FooterGroup = styled.div`
  display: flex;
  align-items: stretch;
`
