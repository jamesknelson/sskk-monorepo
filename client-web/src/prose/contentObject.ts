import { EditorState } from 'prosemirror-state'

import { Schema, schema } from './schema'

export function createStateFromContentObject(content: any): EditorState {
  return EditorState.fromJSON(
    { schema },
    {
      doc: content,
      selection: { head: 0, anchor: 0, type: 'text' },
    },
  )
}

export function serializeToContentObject(state: EditorState<Schema>) {
  return state.toJSON().doc
}
