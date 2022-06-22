import { css } from '@emotion/react'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView, EditorProps as ProsemirrorProps } from 'prosemirror-view'
import {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useHasHydrated } from 'retil-hydration'
import { createState, Source } from 'retil-source'

import { Schema } from 'lib-prose/schema'

import { createSuspenseLoader } from '~/util/createSuspenseLoader'

export interface EditorHandle {
  root: HTMLDivElement
  view: EditorView
  focus: () => void
  blur: () => void
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

  handleRef?: React.Ref<EditorHandle>

  minHeight?: string

  state: EditorState

  className?: string
  style?: CSSProperties
}

// Load this at run-time, as doing so accesses the `navigator` object, which
// causes a crash if done during SSR.
const getCodeBlockView = createSuspenseLoader(
  async () => (await import('lib-prose/codeBlockView')).CodeBlockView,
)

// Based on: https://github.com/dminkovsky/use-prosemirror/blob/93edf8ae5323e9cbffa03e793b494a28046d490a/src/ProseMirror.tsx
export const Editor = forwardRef<HTMLDivElement, EditorProps>(function Editor(
  props,
  divRef,
): JSX.Element {
  const handleRef = props.handleRef
  const hasHydrated = useHasHydrated()
  const viewRef = useRef<EditorView<Schema> | null>(null)
  const { className, applyTransaction, state, style, ...restProps } = props
  const { current: initialRestProps } = useRef(restProps)
  const applyTransactionRef = useRef(applyTransaction)
  const restPropKeys = Object.keys(restProps)

  // The first time this is called will cause a Suspense promise to be thrown,
  // so we don't want to call it until hydration has completed.
  const CodeBlockView = hasHydrated && getCodeBlockView()

  const focus = useCallback(() => {
    viewRef.current?.focus()
  }, [])

  // Needed for compatibility with retil-interaction focus delegation
  const blur = useCallback(() => {}, [])

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

        const handle = {
          root,
          view,
          focus,
          blur,
        }

        if (typeof handleRef === 'function') {
          handleRef(handle)
        } else if (handleRef) {
          ;(handleRef as React.MutableRefObject<EditorHandle>).current = handle
        }
      } else {
        if (typeof handleRef === 'function') {
          handleRef(null)
        } else if (handleRef) {
          ;(handleRef as React.MutableRefObject<null>).current = null
        }

        if (viewRef.current) {
          viewRef.current.destroy()
          viewRef.current = null
        }
      }

      if (typeof divRef === 'function') {
        divRef(root)
      } else if (divRef) {
        divRef.current = root
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [CodeBlockView],
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

export type EditorApplyTransaction = (
  state: EditorState,
  transaction: Transaction,
) => EditorState

export interface EditorStateHandle {
  set: (editorState: EditorState) => void
  applyTransaction: EditorApplyTransaction
}

// This is implemented as a source instead of a `setState`, so that we're able
// to subscribe to editor state updates only at the place where they're used –
// eliminating unnecessary updates in response to keystrokes, and improving
// responsiveness.
export function useEditorStateSource(
  getInitialEditorState: () => EditorState,
  onChange?: (editorState: EditorState) => void,
): readonly [Source<EditorState>, EditorStateHandle] {
  const [[source, set]] = useState(() => createState(getInitialEditorState()))

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
      set(newState)
      if (onChange && newState !== state) {
        onChange(newState)
      }
      return newState
    },
    [onChange, set],
  )

  const editorHandle = useMemo(
    () => ({
      applyTransaction,
      set,
    }),
    [applyTransaction, set],
  )

  return [source, editorHandle] as const
}
