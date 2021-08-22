import { format, formatISO } from 'date-fns'
import { EditorState } from 'prosemirror-state'
import React from 'react'
import { LinkSurface } from 'retil-interaction'
import { css } from 'styled-components'

import { Card } from 'src/components/card'
import { TextContent } from 'src/components/textContent'
import { useAppEnv } from 'src/env'
import { Schema } from 'src/prose/schema'
import { colors, media, mediaSelectors } from 'src/theme'
import { urls } from 'src/utils/urls'

import { LetterContent } from './letterContent'

export type LetterCardProps = React.ComponentProps<typeof Card> & {
  disableEdit?: boolean
  disableTitlePath?: boolean
  editorState?: EditorState<Schema>
  profileAvatarURL?: string | null
  profileDisplayName: string
  profileNametag: string
  publishedAt?: Date
  letterId?: string
  letterSlug?: string
  titleAs?: 'h1' | 'h2'
}

export function LetterCard(props: LetterCardProps) {
  const { profile } = useAppEnv()

  const {
    children,
    disableEdit,
    disableTitlePath,
    editorState,
    profileAvatarURL,
    profileDisplayName,
    profileNametag,
    publishedAt,
    letterId,
    letterSlug,
    titleAs,
    ...rest
  } = props

  const canCancel = publishedAt && publishedAt > new Date()
  const canEdit =
    !disableEdit && letterId && profile && profile.handle === profileNametag

  const path =
    letterId &&
    publishedAt &&
    urls.letter({
      profileNametag: profileNametag,
      letterId,
      letterSlug,
    })?.pathname

  const content = children || (
    <LetterContent
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
          <LinkSurface
            href={urls.profile({ nametag: profileNametag })}
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
                <img src={profileAvatarURL} width={40} height={40} />
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
                @{profileNametag}
              </span>
            </span>
          </LinkSurface>
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
              {canEdit && letterId && (
                <>
                  <LinkSurface
                    css={css`
                      text-decoration: underline;
                    `}
                    href={urls.editor.letter({ letterId })}>
                    edit
                  </LinkSurface>
                  <span
                    css={css`
                      padding: 0 0.5rem;

                      ${mediaSelectors.phoneOnly(css`
                        display: none;
                      `)}
                    `}>
                    &middot;
                  </span>
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
                  <LinkSurface href={path}>
                    <time dateTime={formatISO(publishedAt)}>
                      {format(publishedAt, 'PPP')}
                    </time>
                  </LinkSurface>
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
