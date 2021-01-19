import { EditorState } from 'prosemirror-state'

import { Schema } from './schema'

export function getTitle(state: EditorState<Schema>): string | null {
  const firstBlock = state.doc.content.firstChild
  return (firstBlock?.type.name === 'title' && firstBlock.textContent) || null
}
