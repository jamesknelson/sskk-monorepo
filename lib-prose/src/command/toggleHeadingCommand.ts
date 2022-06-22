import { EditorState, Transaction } from 'prosemirror-state'
import { findParentNodeOfType } from 'prosemirror-utils'

import { noop } from 'retil-support'

import { toggleHeading } from '~/function/toggleHeading'
import { HEADING } from '~/nodeNames'
import { createProseCommand } from '~/proseCommand'

export function createToggleHeadingCommand(level: number) {
  return createProseCommand({
    executeOrPerformDryRun(
      state: EditorState,
      dispatch: null | ((tr: Transaction) => void),
    ): boolean {
      const { schema, selection } = state
      const tr = toggleHeading(state.tr.setSelection(selection), schema, level)
      if (tr.docChanged) {
        dispatch && dispatch(tr)
        return true
      } else {
        return false
      }
    },

    isActive(state: EditorState): boolean {
      const result = findHeading(state)
      return !!(
        result &&
        result.node &&
        result.node.attrs &&
        result.node.attrs.level === level
      )
    },
  })
}

function findHeading(state: EditorState) {
  const heading = state.schema.nodes[HEADING]
  const fn = heading ? findParentNodeOfType(heading) : noop
  return fn(state.selection)
}
