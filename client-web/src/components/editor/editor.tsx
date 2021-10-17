import { css } from '@emotion/react'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView, EditorProps as ProsemirrorProps } from 'prosemirror-view'
import {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAppEnv } from 'src/env'

import { Schema } from 'src/prose/schema'
import { createSuspenseLoader } from 'src/utils/createSuspenseLoader'

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

  autoFocus?: boolean

  minHeight?: string

  state: EditorState

  className?: string
  style?: CSSProperties
}

// Load this at run-time, as doing so accesses the `navigator` object, which
// causes a crash if done during SSR.
const getCodeBlockView = createSuspenseLoader(
  async () => (await import('src/prose/codeBlockView')).CodeBlockView,
)

// Based on: https://github.com/dminkovsky/use-prosemirror/blob/93edf8ae5323e9cbffa03e793b494a28046d490a/src/ProseMirror.tsx
export const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(
  props,
  ref,
): JSX.Element {
  const env = useAppEnv()
  const viewRef = useRef<EditorView<Schema> | null>(null)
  const { className, applyTransaction, state, style, ...restProps } = props
  const { current: initialRestProps } = useRef(restProps)
  const applyTransactionRef = useRef(applyTransaction)
  const restPropKeys = Object.keys(restProps)

  // The first time this is called will cause a Suspense promise to be thrown,
  // so we don't want to call it until hydration has completed.
  const CodeBlockView = env.hasHydrated && getCodeBlockView()

  const wrapperRef = useCallback(
    async (root: HTMLDivElement | null) => {
      if (CodeBlockView && root) {
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

        if (props.autoFocus) {
          viewRef.current?.focus()
        }

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, restPropKeys)

  return (
    <div
      ref={wrapperRef}
      style={style}
      className={className}
      css={css`
        ${props.minHeight &&
        css`
          .ProseMirror {
            min-height: ${props.minHeight};
          }
          min-height: ${props.minHeight};
        `}

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

export function useEditorState(getInitialEditorState: () => EditorState) {
  const [editorState, setEditorState] = useState(getInitialEditorState)

  // This function acts a little like a combination between a reducer and a
  // `dispatch` function. It receives a state and an action ("transaction"),
  // computes the new state, and then both calls `setEditorState` to store the
  // state in the React component, *and* returns the new state to be
  // synchronously set on ProseMirror's internal state store.
  //
  // It's important that the state also be returned to be synchronously set on
  // ProseMirror's internal state store, as React's slight delay in updating
  // state can cause bugs with ProseMirror.
  const applyTransaction = useCallback(
    (state: EditorState, transaction: Transaction) => {
      const newState = state.apply(transaction)
      setEditorState(newState)
      return newState
    },
    [],
  )

  return [editorState, setEditorState, applyTransaction] as const
}
