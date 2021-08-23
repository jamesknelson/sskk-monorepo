import { useMutation } from '@apollo/client'
import { formatISO } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  ButtonSurface,
  ControlProvider,
  SubmitButtonSurface,
} from 'retil-interaction'
import { joinPathnames, useNavController } from 'retil-nav'
import { useOperation } from 'retil-operation'
import slugify from 'slugify'
import styled, { css } from 'styled-components'

import { ButtonBody } from 'src/components/buttons'
import { Card } from 'src/components/card/card'
import {
  Editor,
  EditorHandle,
  EditorMenu,
  useEditorState,
} from 'src/components/editor'
import { LetterCard } from 'src/components/letter'
import { Edit, Message, Trash, X } from 'src/constants/glyphs'
import {
  createEditorState,
  getTitle,
  serializeToContentObject,
  isEmpty,
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
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/precachedQuery'
import { useAppEnv } from 'src/env'

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
  const env = useAppEnv()
  const profile = env.profile!
  const { navigate } = useNavController()
  const { data } = usePrecachedQuery(query)
  const post = data?.post || {
    id: undefined,
    versions: [],
    published_at: null,
    updated_at: null,
    deleted_at: null,
  }
  const version = post.versions[0]

  const editorHandleRef = useRef<EditorHandle | null>(null)

  const [editorState, setEditorState, applyEditorTransaction] = useEditorState(
    () => createEditorState(version?.editor_state),
  )

  useEffect(() => {
    setEditorState(createEditorState(version?.editor_state))
  }, [post.id])

  const [lastSavedDoc, setLastSavedDoc] = useState(editorState.doc)

  const empty = isEmpty(editorState)
  const title = getTitle(editorState)
  const slug = slugify(title || '', {
    lower: true,
    strict: true,
  })

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
            profile_id: env.profile!.id,
            version,
          },
        })
        const insertedId = result.data?.insert_posts_one?.id
        if (insertedId) {
          await navigate(
            joinPathnames(env.nav.pathname, '..', '..', 'story', insertedId),
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
        await navigate(joinPathnames(env.nav.pathname, '..', '..', 'stories'))
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
  const canSave = !savePending && !empty && lastSavedDoc !== editorState.doc
  const canPublish =
    !publishPending &&
    (canSave ||
      (!canSave &&
        !savePending &&
        !empty &&
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
      <Helmet>
        <title>
          {post.id ? `Edit ${title ? `"${title}"` : 'story'}` : 'New story'}
        </title>
      </Helmet>

      <form
        onSubmit={handleSubmit}
        css={css`
          margin: 0.5rem auto;
          max-width: ${dimensions.largeCardWidth};
          width: calc(100% - 1rem);
        `}>
        <ControlProvider>
          <Card
            css={css`
              height: 48px;
            `}>
            <EditorMenu
              state={editorState}
              applyTransaction={applyEditorTransaction}
            />
          </Card>
          <LetterCard
            disableEdit
            profileAvatarURL={profile.avatarURL}
            profileDisplayName={profile.displayName}
            profileId={profile.id}
            profileNametag={profile.handle!}
            publishedAt={publishedAt}
            letterId={post.id}
            letterSlug={version?.slug}
            css={css`
              margin: 0.25rem 0;
            `}>
            {empty && (
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
              ref={editorHandleRef}
            />
          </LetterCard>
        </ControlProvider>
        <Card as="footer">
          <FooterLayout>
            <FooterGroup>
              <ButtonSurface disabled={!canPublish} onTrigger={doPublish}>
                <ButtonBody busy={publishPending} glyph={Message}>
                  {publishedAt ? 'Revise' : 'Publish'}
                </ButtonBody>
              </ButtonSurface>

              <SubmitButtonSurface disabled={!canSave}>
                <ButtonBody
                  busy={!publishPending && savePending}
                  glyph={Edit}
                  outline
                  css={css`
                    margin-left: 0.5rem;
                  `}>
                  Save draft{publishedAt ? ' revision' : ''}
                </ButtonBody>
              </SubmitButtonSurface>
            </FooterGroup>
            <FooterGroup>
              {canCancel ? (
                <ButtonSurface disabled={!canCancel} onTrigger={doCancel}>
                  <ButtonBody busy={cancelPending} glyph={X} outline>
                    Cancel
                  </ButtonBody>
                </ButtonSurface>
              ) : (
                <ButtonSurface disabled={!canDelete} onTrigger={doDelete}>
                  <ButtonBody busy={deletePending} glyph={Trash} outline>
                    Delete
                  </ButtonBody>
                </ButtonSurface>
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
