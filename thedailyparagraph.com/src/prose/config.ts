import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { EditorState, Plugin } from 'prosemirror-state'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { menuBar } from 'prosemirror-menu'

import { arrowHandlers } from './arrowHandlers'
import { buildMenuItems } from './menu'
import { buildKeymap } from './keymap'
import { buildInputRules } from './inputRules'
import { schema } from './schema'

export { buildMenuItems, buildKeymap, buildInputRules }

export const config = {
  schema,
  plugins: [
    buildInputRules(schema),
    keymap(buildKeymap(schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    menuBar({
      floating: false,
      content: buildMenuItems(schema),
    }),
    history(),
    new Plugin({
      props: {
        attributes: { class: 'ProseMirror-example-setup-style' },
      },
    }),
    arrowHandlers,
  ],
}

export const createEditorState = (initialStateJSON?: any) =>
  initialStateJSON
    ? EditorState.fromJSON(config, initialStateJSON)
    : EditorState.create(config)
