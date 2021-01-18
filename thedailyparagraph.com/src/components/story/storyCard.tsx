import { format, formatISO } from 'date-fns'
import React from 'react'
import { Link } from 'retil-router'
import { css } from 'styled-components'

import { Card } from 'src/components/card'
import { TextContent } from 'src/components/textContent'
import { colors } from 'src/theme'
import { useAppRequest } from 'src/utils/routing'
import { encodeUUID } from 'src/utils/uuid'

export type StoryCardProps = React.ComponentProps<typeof Card> & {
  profileDisplayName: string
  profileHandle: string
  publishedAt?: Date
  storyId?: string
}

export function StoryCard(props: StoryCardProps) {
  const { profile } = useAppRequest()

  const {
    children,
    profileId: editHref,
    profileDisplayName,
    profileHandle,
    publishedAt,
    storyId,
    ...rest
  } = props

  const canCancel = publishedAt && publishedAt > new Date()
  const canEdit = profile && profile.handle === profileHandle

  return (
    <Card as="article" {...rest}>
      <header
        css={css`
          padding: 1.5rem 2rem 0;

          a {
            text-decoration: underline;
            :hover {
              opacity: 0.8;
            }
          }
        `}>
        <div
          css={css`
            font-size: 0.9rem;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid ${colors.structure.border};
            padding-bottom: 0.25rem;
          `}>
          <span
            css={css`
              margin-right: 0.375rem;
            `}>
            <span
              css={css`
                font-weight: 700;
              `}>
              {profileDisplayName}
            </span>
            <span
              css={css`
                color: ${colors.text.tertiary};
                margin: 0 0.375rem;
              `}>
              @{profileHandle}
            </span>
          </span>
          <span
            css={css`
              &,
              a {
                color: ${colors.text.tertiary};
              }
            `}>
            {publishedAt && (
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
                  <Link to={`/@${profileHandle}/${encodeUUID(storyId!)}`}>
                    <time dateTime={formatISO(publishedAt)}>
                      {format(publishedAt, 'PPP')}
                    </time>
                  </Link>
                )}
              </>
            )}
            {canEdit && publishedAt && (
              <span
                css={css`
                  padding: 0 0.5rem;
                `}>
                &middot;
              </span>
            )}
            {canEdit && (
              <Link to={`/dashboard/story/${encodeUUID(storyId!)}`}>edit</Link>
            )}
          </span>
        </div>
      </header>
      <TextContent
        css={css`
          padding: 0rem 2rem 1rem;
        `}>
        {children}
      </TextContent>
    </Card>
  )
}
