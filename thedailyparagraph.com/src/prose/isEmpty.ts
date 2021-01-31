import { EditorState } from 'prosemirror-state'

import { Schema } from './schema'

export function isEmpty(state: EditorState<Schema>): boolean {
  const doc = state.doc
  const firstChild = doc.firstChild!
  return doc.childCount === 1 && firstChild.childCount === 0
}
