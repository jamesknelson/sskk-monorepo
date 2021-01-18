import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView, EditorProps as ProsemirrorProps } from 'prosemirror-view'
import React, {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { css } from 'styled-components'

import { CodeBlockView } from './codeBlockView'
import { config } from './config'
import { Schema } from './schema'

export interface EditorHandle {
  root: HTMLDivElement
  view: EditorView
}

export interface EditorProps extends ProsemirrorProps {
  // This has to be synchronous, as our codemirror integration requires
  // transactions to be applied synchronously. You can still apply asynchronous
  // updates by updating `state` to a different value after the fact.
  applyTransaction: (
    state: EditorState,
    transaction: Transaction,
  ) => EditorState | null

  state: EditorState

  className?: string
  style?: CSSProperties
}

// Based on: https://github.com/dminkovsky/use-prosemirror/blob/93edf8ae5323e9cbffa03e793b494a28046d490a/src/ProseMirror.tsx
export const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(
  props,
  ref,
): JSX.Element {
  const viewRef = useRef<EditorView<Schema> | null>(null)
  const { className, applyTransaction, state, style, ...restProps } = props
  const { current: initialRestProps } = useRef(restProps)
  const applyTransactionRef = useRef(applyTransaction)
  const restPropKeys = Object.keys(restProps)

  const wrapperRef = useCallback((root: HTMLDivElement | null) => {
    if (root) {
      const view = new EditorView(root, {
        ...restProps,
        state,
        nodeViews: {
          code_block: (node, view, getPos) =>
            new CodeBlockView(node, view, getPos as () => number),
        },
        dispatchTransaction: (transaction: Transaction) => {
          if (applyTransactionRef.current) {
            const newState = applyTransactionRef.current(
              view.state,
              transaction,
            )
            if (newState) {
              view.updateState(newState)
            }
          }
        },
      })

      viewRef.current = view

      if (typeof ref === 'function') {
        ref({
          root,
          view,
        })
      } else if (ref) {
        ref.current = {
          root,
          view,
        }
      }
    } else {
      if (typeof ref === 'function') {
        ref(null)
      } else if (ref) {
        ref.current = null
      }

      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    applyTransactionRef.current = applyTransaction
  }, [applyTransaction])

  useEffect(() => {
    // Generally we'll have already updated the state within
    // `dispatchTransaction`, so we want to check that there's actually been
    // a change before applying it.
    if (viewRef.current?.state !== state) {
      viewRef.current?.updateState(state)
    }
  }, [state])

  useEffect(() => {
    if (initialRestProps !== restProps) {
      viewRef.current?.setProps(restProps)
    }
  }, restPropKeys)

  return (
    <div
      ref={wrapperRef}
      style={style}
      className={className}
      css={css`
        border: 1px solid black;

        .CodeMirror {
          border: 1px solid #eee;
          height: auto;
        }
        .CodeMirror pre {
          white-space: pre !important;
        }
      `}
    />
  )
})

export function useEditorState(initialStateJSON?: any) {
  const [editorState, setEditorState] = useState(() =>
    initialStateJSON
      ? EditorState.fromJSON(config, initialStateJSON)
      : EditorState.create(config),
  )

  const applyTransaction = useCallback(
    (state: EditorState, transaction: Transaction) => {
      const newState = state.apply(transaction)
      setEditorState(newState)
      return newState
    },
    [],
  )

  return [editorState, applyTransaction] as const
}

export function serializeEditorState(state: EditorState<Schema>) {
  return state.toJSON()
}

export function serializeContent(state: EditorState<Schema>) {
  return state.toJSON().doc
}
