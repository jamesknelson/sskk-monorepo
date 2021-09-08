import { toggleMark } from 'prosemirror-commands'
import { EditorState, TextSelection, Transaction } from 'prosemirror-state'

import { createProseCommand } from 'src/prose/proseCommand'
import { findNodesWithSameMark } from 'src/prose/functions/findNodesWithSameMark'

export function createToggleMarkCommand(markName: string) {
  return createProseCommand({
    executeOrPerformDryRun(
      state: EditorState,
      dispatch: null | ((tr: Transaction) => void),
    ): boolean {
      const { schema, selection, tr } = state
      const markType = schema.marks[markName]
      if (!markType) {
        return false
      }

      if (selection.empty && !(selection instanceof TextSelection)) {
        return false
      }

      const { from, to } = selection
      if (tr && to === from + 1) {
        const node = tr.doc.nodeAt(from)
        if (node?.isAtom && !node.isText && node.isLeaf) {
          // An atomic node (e.g. Image) is selected.
          return false
        }
      }

      // TODO: Replace `toggleMark` with transform that does not change scroll
      // position.
      return toggleMark(markType)(state, dispatch || undefined)
    },

    isActive(state: EditorState): boolean {
      const { schema, doc, selection } = state
      const { from, to } = selection
      const markType = schema.marks[markName]
      if (markType && from < to) {
        return !!findNodesWithSameMark(doc, from, to - 1, markType)
      }
      return false
    },
  })
}
