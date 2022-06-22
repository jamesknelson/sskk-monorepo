import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import {
  FocusableDefaultProvider,
  ButtonSurface,
  inActiveSurface,
  inSelectedSurface,
} from 'retil-interaction'

import { createToggleMarkCommand } from 'lib-prose/command/toggleMarkCommand'
import { MARK_EM, MARK_STRONG } from 'lib-prose/markNames'

import { FormatBold, FormatItalic } from '~/asset/glyph'
import { IconButtonBody } from '~/component/button/iconButtonBody'
import { Theme } from '~/theme'

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

const iconColorScheme = (theme: Theme) => ({
  default: theme.color.primary[900],
  [inActiveSurface]: theme.color.secondary[500],
  [inSelectedSurface]: theme.color.secondary[500],
})

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
          color={iconColorScheme}
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
          color={iconColorScheme}
        />
      </ButtonSurface>
    </FocusableDefaultProvider>
  )
}
