import { format, formatISO } from 'date-fns'
import Image from 'next/image'
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
  profileAvatarURL?: string | null
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
    profileAvatarURL,
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
    publishedAt &&
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
          padding: 1rem 2rem 0.5rem;
          ${media.phoneOnly`
            padding: 0;
          `}
        `}>
        <div
          css={css`
            font-size: 0.9rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 1px solid ${colors.structure.border};
            padding-bottom: 0.75rem;

            ${media.phoneOnly`
              padding: 1rem 1rem 0.75rem;
            `}
          `}>
          <Link
            to={`/@${profileHandle}`}
            css={css`
              display: flex;
              justify-content: flex-start;
              align-items: flex-end;
              text-decoration: none;
            `}>
            {profileAvatarURL && (
              <span
                css={css`
                  border-radius: 9999px;
                  overflow: hidden;
                  height: 40px;
                  width: 40px;
                  display: block;
                  margin-right: 0.5rem;
                  margin-bottom: 4px;
                `}>
                <Image src={profileAvatarURL} width={40} height={40} />
              </span>
            )}
            <span>
              <span
                css={css`
                  color: ${colors.ink.black};
                  font-weight: 700;
                  margin-right: 0.375rem;
                  line-height: 1rem;
                  display: block;
                `}>
                {profileDisplayName}
              </span>
              <span
                css={css`
                  color: ${colors.text.tertiary};
                  margin-left: -1px;
                `}>
                @{profileHandle}
              </span>
            </span>
          </Link>
          <span
            css={css`
              ${media.phoneOnly`
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: flex-end;
              `}

              &,
              a {
                color: ${colors.text.tertiary};
              }
            `}>
            <span>
              {canEdit && (
                <>
                  <Link
                    css={css`
                      text-decoration: underline;
                    `}
                    to={`/dashboard/story/${encodeUUID(storyId!)}`}>
                    edit
                  </Link>
                  <TabletPlus
                    inline
                    css={css`
                      padding: 0 0.5rem;
                    `}>
                    &middot;
                  </TabletPlus>
                </>
              )}
            </span>
            {path && publishedAt ? (
              <>
                {canCancel && (
                  <span
                    css={css`
                      font-style: italic;
                      line-height: 1rem;
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
              <span>draft</span>
            )}
          </span>
        </div>
      </header>
      <TextContent>{content}</TextContent>
      <div
        css={css`
          height: 1rem;
        `}
      />
    </Card>
  )
}
