import { format, formatISO } from 'date-fns'
import { css } from '@emotion/react'
import { EditorState } from 'prosemirror-state'
import React from 'react'
import { LinkSurface } from 'retil-interaction'

import { TextBlock } from 'src/components/web/block/textBlock'
import { useAppEnv } from 'src/env'
import urls from 'src/routes/appURLs'
import { Card } from 'src/components/web/card/card'
import { Schema } from 'src/prose/schema'

import { LetterContent } from './letterContent'

export type LetterCardProps = React.ComponentProps<typeof Card> & {
  disableEdit?: boolean
  disableTitlePath?: boolean
  editorState?: EditorState<Schema>
  personaId: string
  personaAvatarURL?: string | null
  personaDisplayName: string
  personaAddress: string
  publishedAt?: Date
  letterId?: string
  letterSlug?: string | null
  titleAs?: 'h1' | 'h2'
}

export function LetterCard(props: LetterCardProps) {
  const { customer } = useAppEnv()

  const {
    children,
    disableEdit,
    disableTitlePath,
    editorState,
    personaId,
    personaAvatarURL,
    personaDisplayName,
    personaAddress,
    publishedAt,
    letterId,
    letterSlug,
    titleAs,
    ...rest
  } = props

  const canCancel = publishedAt && publishedAt > new Date()
  const canEdit =
    !disableEdit &&
    letterId &&
    customer &&
    customer.personas.map((persona) => persona.id).includes(personaId)

  const path =
    letterId &&
    publishedAt &&
    urls.letter({
      personaAddress,
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
        `}>
        <div
          css={css`
            font-size: 0.9rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 1px solid ${structureColors.border};
            padding-bottom: 0.75rem;
          `}>
          <LinkSurface
            href={urls.profile({ nametag: personaAddress })}
            css={css`
              display: flex;
              justify-content: flex-start;
              align-items: flex-end;
              text-decoration: none;
            `}>
            {personaAvatarURL && (
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
                <img
                  alt={personaDisplayName}
                  src={personaAvatarURL}
                  width={40}
                  height={40}
                />
              </span>
            )}
            <span>
              <span
                css={css`
                  color: ${paletteColors.ink900};
                  font-weight: 700;
                  margin-right: 0.375rem;
                  line-height: 1rem;
                  display: block;
                `}>
                {personaDisplayName}
              </span>
              <span
                css={css`
                  color: ${textColors.tertiary};
                  margin-left: -1px;
                `}>
                @{personaAddress}
              </span>
            </span>
          </LinkSurface>
          <span
            css={css`
              &,
              a {
                color: ${textColors.tertiary};
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
                    css={[
                      css`
                        padding: 0 0.5rem;
                      `,
                    ]}>
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
      <TextBlock>{content}</TextBlock>
      <div
        css={css`
          height: 1rem;
        `}
      />
    </Card>
  )
}
