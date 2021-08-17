import { history } from 'prosemirror-history'
import { EditorState } from 'prosemirror-state'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'

import { buildMenuItems } from './menu'
import { buildKeymap } from './keymap'
import { buildInputRules } from './inputRules'
import { schema } from './schema'

export { buildMenuItems, buildKeymap, buildInputRules }

export const config = {
  schema,
  plugins: [
    buildInputRules(schema),
    buildKeymap(schema),
    dropCursor(),
    gapCursor(),
    history(),
  ],
}

export const createEditorState = (initialStateJSON?: any) =>
  initialStateJSON
    ? EditorState.fromJSON(config, initialStateJSON)
    : EditorState.create(config)
