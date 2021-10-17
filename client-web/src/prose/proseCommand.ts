import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

export interface ProseCommand {
  /**
   * If this is a toggle or selection command, this will return true if this
   * command is currently "enabled".
   */
  isActive?(state: EditorState): boolean

  /**
   * Can the command currently be executed?
   */
  isEnabled(state: EditorState, view?: EditorView): boolean

  execute(
    state: EditorState,
    dispatch: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean
}

interface ProseCommandOptions {
  /**
   * This corresponds to the ProseMirror "command" function type, which
   * accepts an optional `dispatch` function, performing a dry run if
   * missing. Whether provided or not, the function should return a boolean
   * indicating whether the state did (or would) change.
   */
  executeOrPerformDryRun: (
    state: EditorState,
    dispatch: null | ((tr: Transaction) => void),
    view?: EditorView,
  ) => boolean

  /**
   * If this is a toggle or selection command, this will return true if this
   * command is currently "enabled".
   */
  isActive?(state: EditorState): boolean
}

export function createProseCommand({
  executeOrPerformDryRun,
  isActive,
}: ProseCommandOptions): ProseCommand {
  const isEnabled = (state: EditorState, view?: EditorView): boolean => {
    const dryRunState = new Proxy(state, {
      get: dryRunEditorStateProxyGetter,
      set: dryRunEditorStateProxySetter,
    })
    return executeOrPerformDryRun(dryRunState, null, view)
  }

  return {
    execute: executeOrPerformDryRun,
    isActive,
    isEnabled,
  }
}

function dryRunEditorStateProxyGetter(
  state: EditorState,
  propKey: keyof EditorState,
): any {
  const val = state[propKey]
  if (propKey === 'tr' && val instanceof Transaction) {
    return state.tr.setMeta('dryrun', true)
  }
  return val
}

function dryRunEditorStateProxySetter(
  state: EditorState,
  propKey: keyof EditorState,
  propValue: any,
): boolean {
  state[propKey] = propValue
  // Indicate success
  return true
}
