import { EditorState } from 'prosemirror-state'
import React from 'react'
import { Link } from 'retil-router'

import { renderJSONToReact } from 'src/prose/reactSerializer'
import { Schema } from 'src/prose/schema'

export interface StoryContentProps {
  editorState: EditorState<Schema>
  path?: string
  titleAs?: 'h1' | 'h2'
}

export function StoryContent(props: StoryContentProps) {
  const { editorState, path, titleAs: TitleAs = 'h2' } = props

  return (
    <>
      {renderJSONToReact(editorState, {
        nodes: {
          title: () => (children: React.ReactNode) => (
            <TitleAs style={{ marginTop: '1.5rem' }}>
              {path ? <Link to={path}>{children}</Link> : children}
            </TitleAs>
          ),
        },
      })}
    </>
  )
}
