import { EditorState } from 'prosemirror-state'
import styled from 'styled-components'
import React from 'react'
import { Link } from 'retil-router'

import { renderJSONToReact } from 'src/prose/reactSerializer'
import { Schema } from 'src/prose/schema'
import { media } from 'src/theme'

export interface StoryContentProps {
  editorState: EditorState<Schema>
  path?: string
  titleAs?: 'h1' | 'h2'
}

export function StoryContent(props: StoryContentProps) {
  const { editorState, path, titleAs = 'h2' } = props

  return (
    <>
      {renderJSONToReact(editorState, {
        nodes: {
          title: () => (children: React.ReactNode) => (
            <StyledTitle as={titleAs}>
              {path ? <Link to={path}>{children}</Link> : children}
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
