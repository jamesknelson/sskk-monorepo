import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import {
  FocusableDefaultProvider,
  ButtonSurface,
  inActiveSurface,
  inSelectedSurface,
} from 'retil-interaction'

import { FormatBold, FormatItalic } from 'src/assets/glyphs'
import { createToggleMarkCommand } from 'src/prose/commands/toggleMarkCommand'
import { MARK_EM, MARK_STRONG } from 'src/prose/markNames'
import { IconButtonBody } from 'src/presentation/iconButtonBody'
import { paletteColors } from 'src/presentation/colors'

import { EditorHandle } from './editor'

const toggleStrongCommand = createToggleMarkCommand(MARK_STRONG)
const toggleEmCommand = createToggleMarkCommand(MARK_EM)

export interface EditorMenuProps {
  applyTransaction: (
    state: EditorState,
    transaction: Transaction,
  ) => EditorState

  state: EditorState

  editorHandleRef: React.RefObject<EditorHandle>

  view?: EditorView | null
}

export function EditorMenu(props: EditorMenuProps) {
  const { applyTransaction, editorHandleRef, state } = props

  return (
    <FocusableDefaultProvider value={editorHandleRef}>
      <ButtonSurface
        onTrigger={() => {
          toggleStrongCommand.execute(state, (transaction) => {
            applyTransaction(state, transaction)
          })
        }}>
        <IconButtonBody
          glyph={FormatBold}
          label="Bold"
          color={{
            default: paletteColors.ink900,
            [inActiveSurface]: paletteColors.focusBlue,
            [inSelectedSurface]: paletteColors.focusBlue,
          }}
        />
      </ButtonSurface>
      <ButtonSurface
        onTrigger={() => {
          toggleEmCommand.execute(state, (transaction) => {
            applyTransaction(state, transaction)
          })
        }}>
        <IconButtonBody
          glyph={FormatItalic}
          label="Italic"
          color={{
            default: paletteColors.ink900,
            [inActiveSurface]: paletteColors.focusBlue,
            [inSelectedSurface]: paletteColors.focusBlue,
          }}
        />
      </ButtonSurface>
    </FocusableDefaultProvider>
  )
}
