import { format, formatISO } from 'date-fns'
import { EditorState } from 'prosemirror-state'
import React from 'react'
import { Link } from 'retil-router'
import { css } from 'styled-components'

import { Card } from 'src/components/card'
import { TextContent } from 'src/components/textContent'
import { Schema } from 'src/prose/schema'
import { colors, media } from 'src/theme'
import { getStoryPath, useAppRequest } from 'src/utils/routing'
import { encodeUUID } from 'src/utils/uuid'

import { StoryContent } from './storyContent'
import { TabletPlus } from '../responsive'

export type StoryCardProps = React.ComponentProps<typeof Card> & {
  disableEdit?: boolean
  disableTitlePath?: boolean
  editorState?: EditorState<Schema>
  profileDisplayName: string
  profileHandle?: string
  profileId: string
  publishedAt?: Date
  storyId?: string
  storySlug?: string | null
  titleAs?: 'h1' | 'h2'
}

export function StoryCard(props: StoryCardProps) {
  const { profile } = useAppRequest()

  const {
    children,
    disableEdit,
    disableTitlePath,
    editorState,
    profileDisplayName,
    profileHandle,
    profileId,
    publishedAt,
    storyId,
    storySlug,
    titleAs,
    ...rest
  } = props

  const canCancel = publishedAt && publishedAt > new Date()
  const canEdit =
    !disableEdit && storyId && profile && profile.handle === profileHandle

  const path =
    storyId &&
    getStoryPath({
      profileId,
      profileHandle,
      publishedAt,
      storyId,
      storySlug,
    })

  const content = children || (
    <StoryContent
      editorState={editorState!}
      path={disableTitlePath ? undefined : path}
      titleAs={titleAs}
    />
  )

  return (
    <Card as="article" {...rest}>
      <header
        css={css`
          padding: 1.5rem 2rem 0;
          ${media.phoneOnly`
            padding: 0;
          `}

          a:hover {
            text-decoration: underline;
          }
        `}>
        <div
          css={css`
            font-size: 0.9rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 1px solid ${colors.structure.border};
            padding-bottom: 0.25rem;

            ${media.phoneOnly`
              padding: 1rem 1.5rem 0.5rem;
            `}
          `}>
          <span
            css={css`
              margin-right: 0.375rem;
            `}>
            <span
              css={css`
                font-weight: 700;
                margin-right: 0.375rem;
                line-height: 1.25rem;
                ${media.phoneOnly`
                  display: block;
                `}
              `}>
              {profileDisplayName}
            </span>
            <Link
              to={`/@${profileHandle}`}
              css={css`
                color: ${colors.text.tertiary};
              `}>
              @{profileHandle}
            </Link>
          </span>
          <span
            css={css`
              &,
              a {
                color: ${colors.text.tertiary};
              }
            `}>
            <TabletPlus as="span">
              {canEdit && (
                <Link
                  css={css`
                    text-decoration: underline;
                  `}
                  to={`/dashboard/story/${encodeUUID(storyId!)}`}>
                  edit
                </Link>
              )}
              {canEdit && path && (
                <span
                  css={css`
                    padding: 0 0.5rem;
                  `}>
                  &middot;
                </span>
              )}
            </TabletPlus>
            {path &&
              (publishedAt ? (
                <>
                  {canCancel && (
                    <span
                      css={css`
                        font-style: italic;
                      `}>
                      Publishing at{' '}
                    </span>
                  )}
                  {publishedAt && (
                    <Link to={path}>
                      <time dateTime={formatISO(publishedAt)}>
                        {format(publishedAt, 'PPP')}
                      </time>
                    </Link>
                  )}
                </>
              ) : (
                <Link to={path}>draft</Link>
              ))}
          </span>
        </div>
      </header>
      <TextContent
        css={css`
          padding: 0rem 2rem 1rem;
          ${media.phoneOnly`
            padding: 0 1.5rem 1rem;
          `}
        `}>
        {content}
      </TextContent>
    </Card>
  )
}
