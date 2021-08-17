import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { ButtonSurface } from 'retil-interactions'

import { Icon } from 'src/components/icon'
import { FormatBold } from 'src/constants/glyphs'
import { createToggleMarkCommand } from 'src/prose/commands/toggleMarkCommand'
import { MARK_STRONG } from 'src/prose/markNames'

const toggleStrongCommand = createToggleMarkCommand(MARK_STRONG)

export interface EditorMenuProps {
  applyTransaction: (
    state: EditorState,
    transaction: Transaction,
  ) => EditorState

  state: EditorState

  view?: EditorView | null
}

export function EditorMenu(props: EditorMenuProps) {
  const { applyTransaction, state } = props

  return (
    <ButtonSurface
      onPress={() => {
        toggleStrongCommand.execute(state, (transaction) => {
          applyTransaction(state, transaction)
        })
      }}>
      <Icon
        glyph={FormatBold}
        color={{
          default: 'black',
          hover: 'red',
        }}
      />
    </ButtonSurface>
  )
}
