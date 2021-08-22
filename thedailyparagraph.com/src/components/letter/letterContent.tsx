import { EditorState } from 'prosemirror-state'
import styled from 'styled-components'
import React from 'react'
import { LinkSurface } from 'retil-interaction'

import { renderJSONToReact } from 'src/prose/reactSerializer'
import { Schema } from 'src/prose/schema'
import { media } from 'src/theme'

export interface LetterContentProps {
  editorState: EditorState<Schema>
  path?: string
  titleAs?: 'h1' | 'h2'
}

export function LetterContent(props: LetterContentProps) {
  const { editorState, path, titleAs = 'h2' } = props

  return (
    <>
      {renderJSONToReact(editorState, {
        nodes: {
          title: () => (children: React.ReactNode) =>
            (
              <StyledTitle as={titleAs}>
                {path ? (
                  <LinkSurface href={path}>{children}</LinkSurface>
                ) : (
                  children
                )}
              </StyledTitle>
            ),
        },
      })}
    </>
  )
}

const StyledTitle = styled.h1`
  margin-top: 1.25rem !important;
  ${media.phoneOnly`
    margin-top: 2rem !important;
  `}
`
