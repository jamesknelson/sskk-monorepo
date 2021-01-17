import { Command } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { Selection } from 'prosemirror-state'
import { Schema } from './schema'

function arrowHandler(dir: 'left' | 'right' | 'down' | 'up'): Command<Schema> {
  return (state, dispatch, view) => {
    if (state.selection.empty && view?.endOfTextblock(dir)) {
      let side = dir == 'left' || dir == 'up' ? -1 : 1,
        $head = state.selection.$head
      let nextPos = Selection.near(
        state.doc.resolve(side > 0 ? $head.after() : $head.before()),
        side,
      )
      if (nextPos.$head && nextPos.$head.parent.type.name == 'code_block') {
        if (dispatch) {
          dispatch(state.tr.setSelection(nextPos))
        }
        return true
      }
    }
    return false
  }
}

export const arrowHandlers = keymap({
  ArrowLeft: arrowHandler('left'),
  ArrowRight: arrowHandler('right'),
  ArrowUp: arrowHandler('up'),
  ArrowDown: arrowHandler('down'),
})
