import { exampleSetup } from 'prosemirror-example-setup'
import { DOMSerializer, Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { EditorState, Transaction } from 'prosemirror-state'
import * as React from 'react'
import { useCallback, useRef, useState } from 'react'
import { css } from 'styled-components'
import { Handle, ProseMirror } from 'use-prosemirror'

const schema = new Schema({
  nodes: addListNodes(
    basicSchema.spec.nodes as any,
    'paragraph block*',
    'block',
  ),
  marks: basicSchema.spec.marks,
})

const editorConfig = {
  schema,
  plugins: exampleSetup({ schema }),
}

export interface EditorProps {
  state: EditorState
  onChange: (nextState: EditorState) => void
}

export function useEditorState(initialStateJSON?: any) {
  return useState(() =>
    initialStateJSON
      ? EditorState.fromJSON(editorConfig, initialStateJSON)
      : EditorState.create(editorConfig),
  )
}

export function serializeEditorState(state: EditorState) {
  return state.toJSON()
}

export function serializeContent(state: EditorState) {
  let fragment = DOMSerializer.fromSchema(schema).serializeFragment(
    state.doc.content,
  )
  let node = document.createElement('div')
  node.appendChild(fragment)
  return node.innerHTML
}

export function Editor({ state, onChange }: EditorProps) {
  const editorRef = useRef<Handle | null>(null)
  const dispatchTransaction = useCallback((transaction: Transaction) => {
    const view = editorRef.current?.view
    if (view) {
      onChange(view.state.apply(transaction))
    }
  }, [])

  return (
    <ProseMirror
      ref={editorRef}
      state={state}
      dispatchTransaction={dispatchTransaction}
      css={css`
        border: 1px solid black;
      `}
    />
  )
}
