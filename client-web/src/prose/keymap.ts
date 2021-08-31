import {
  baseKeymap,
  wrapIn,
  setBlockType,
  chainCommands,
  toggleMark,
  exitCode,
  joinUp,
  joinDown,
  lift,
  selectParentNode,
  Command,
} from 'prosemirror-commands'
import { undo, redo } from 'prosemirror-history'
import { undoInputRule } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import {
  wrapInList,
  splitListItem,
  liftListItem,
  sinkListItem,
} from 'prosemirror-schema-list'
import { Selection } from 'prosemirror-state'

import { Schema } from './schema'

const mac =
  typeof navigator != 'undefined' ? /Mac/.test(navigator.platform) : false

export function buildKeymap(schema: Schema) {
  const insertBreak: Command<Schema> = (state, dispatch) => {
    const br = schema.nodes.hard_break.create()
    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(br).scrollIntoView())
    }
    return true
  }

  const insertRule: Command<Schema> = (state, dispatch) => {
    const hr = schema.nodes.horizontal_rule.create()
    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(hr).scrollIntoView())
    }
    return true
  }

  const keys: Record<string, Command> = {
    ArrowLeft: arrowHandler('left'),
    ArrowRight: arrowHandler('right'),
    ArrowUp: arrowHandler('up'),
    ArrowDown: arrowHandler('down'),
    'Mod-z': undo,
    'Shift-Mod-z': redo,
    Backspace: undoInputRule,
    'Alt-ArrowUp': joinUp,
    'Alt-ArrowDown': joinDown,
    'Mod-BracketLeft': lift,
    Escape: selectParentNode,
    'Mod-b': toggleMark(schema.marks.strong),
    'Mod-i': toggleMark(schema.marks.em),
    'Mod-u': toggleMark(schema.marks.underline),
    'Mod-`': toggleMark(schema.marks.code),
    'Shift-Ctrl-8': wrapInList(schema.nodes.bullet_list),
    'Shift-Ctrl-9': wrapInList(schema.nodes.ordered_list),
    'Ctrl->': wrapIn(schema.nodes.blockquote),
    'Mod-Enter': chainCommands(exitCode, insertBreak),
    'Shift-Enter': chainCommands(exitCode, insertBreak),
    Enter: splitListItem(schema.nodes.list_item),
    'Mod-[': liftListItem(schema.nodes.list_item),
    'Mod-]': sinkListItem(schema.nodes.list_item),
    'Shift-Ctrl-0': setBlockType(schema.nodes.paragraph),
    'Shift-Ctrl-\\': setBlockType(schema.nodes.code_block),
    'Shift-Ctrl-1': setBlockType(schema.nodes.heading, { level: 1 }),
    'Shift-Ctrl-2': setBlockType(schema.nodes.heading, { level: 2 }),
    'Shift-Ctrl-3': setBlockType(schema.nodes.heading, { level: 3 }),
    'Shift-Ctrl-4': setBlockType(schema.nodes.heading, { level: 4 }),
    'Shift-Ctrl-5': setBlockType(schema.nodes.heading, { level: 5 }),
    'Shift-Ctrl-6': setBlockType(schema.nodes.heading, { level: 6 }),
    'Mod-_': insertRule,
  }

  function bind(key: string, cmd: Command) {
    keys[key] = cmd
  }

  if (!mac) {
    bind('Mod-y', redo)
  }

  if (mac) {
    bind('Ctrl-Enter', chainCommands(exitCode, insertBreak))
  }

  Object.keys(baseKeymap).forEach((key) => {
    if (keys[key]) {
      keys[key] = chainCommands(keys[key], baseKeymap[key])
    } else {
      keys[key] = baseKeymap[key]
    }
  })

  return keymap(keys)
}

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
