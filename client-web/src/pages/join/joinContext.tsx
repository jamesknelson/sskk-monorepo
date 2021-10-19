import { EditorState } from 'prosemirror-state'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { useNavController } from 'retil-nav'
import { Source, getSnapshot, subscribe } from 'retil-source'
import { useEffectOnce } from 'retil-support'
import {
  CallbackNode,
  unstable_cancelCallback as cancelCallback,
  unstable_scheduleCallback as scheduleCallback,
  unstable_LowPriority as LowPriority,
} from 'scheduler'

import { EditorStateHandle, useEditorStateSource } from 'src/components/editor'
import { joinEditorStateStorageKey } from 'src/constants/storageKeys'
import { createEditorState } from 'src/prose'

const joinContext = createContext<JoinSnapshot>(null as any)

export type JoinPath = keyof typeof import('./joinURLs')['default']

export interface JoinSnapshot extends JoinState {
  editorStateHandle: EditorStateHandle
  editorStateSource: Source<EditorState>
  path: JoinPath
}

export function useJoinContext() {
  return useContext(joinContext)
}

export interface JoinProviderProps {
  children: React.ReactNode
  mountPath: string
  path: JoinPath
}

export function JoinProvider(props: JoinProviderProps) {
  const { children, mountPath, path } = props
  const persistenceTaskRef = useRef<CallbackNode | null>(null)
  const [editorStateSource, editorStateHandle] = useEditorStateSource(
    getInitialEditorState,
    (editorState) => {
      if (persistenceTaskRef.current) {
        cancelCallback(persistenceTaskRef.current)
      }
      persistenceTaskRef.current = scheduleCallback(LowPriority, () => {
        persistEditorState(editorState)
        persistenceTaskRef.current = null
      })
    },
  )

  const [state, dispatch] = useReducer(joinReducer, {
    // TODO: if logged in, set to 2 or more
    completedSteps:
      path === 'createAccount' ? 2 : path === 'writeIntroLetter' ? 1 : 0,
    path,
  })

  const snapshot = useMemo<JoinSnapshot>(
    () => ({
      editorStateHandle,
      editorStateSource,
      ...state,
    }),
    [editorStateHandle, editorStateSource, state],
  )

  useEffect(() => {
    if (snapshot.path !== path) {
      dispatch({ type: 'setPath', path })
    }
  }, [path, snapshot.path])

  const navController = useNavController()
  useEffectOnce(() => {
    let unblock: null | (() => void) = null

    const handleSnapshot = () => {
      unblock?.()

      const textLength = getSnapshot(editorStateSource).doc.textContent.length
      if (textLength) {
        unblock = !textLength
          ? null
          : navController.block((navigation) => {
              // Don't block closing the tab, as any content should be
              // recoverable by re-opening the closed tab.
              if (!navigation) {
                return false
              }
              if (navigation?.pathname.startsWith(mountPath)) {
                return false
              }
              const leave = window.confirm(
                "Your introduction letter hasn't been saved. Would you like to discard unsaved changes?",
              )
              if (leave) {
                clearPersistedEditorState()
              }
              return !leave
            })
      }
    }

    const unsubscribe = subscribe(editorStateSource, handleSnapshot)

    handleSnapshot()

    return () => {
      unblock?.()
      unsubscribe()
    }
  })

  return (
    <joinContext.Provider value={snapshot}>{children}</joinContext.Provider>
  )
}

interface JoinState {
  completedSteps: number
  path: JoinPath
}

type JoinAction = { type: 'setPath'; path: JoinPath }

function joinReducer(state: JoinState, action: JoinAction): JoinState {
  let completedSteps = state.completedSteps

  if (completedSteps === 0 && action.path !== 'top') {
    completedSteps = 1
  }
  if (completedSteps === 1 && action.path === 'createAccount') {
    completedSteps = 2
  }

  return {
    ...state,
    completedSteps,
    path: action.path,
  }
}

function persistEditorState(editorState: EditorState) {
  try {
    sessionStorage.setItem(
      joinEditorStateStorageKey,
      JSON.stringify(editorState.toJSON()),
    )
  } catch {}
}

function clearPersistedEditorState() {
  try {
    sessionStorage.removeItem(joinEditorStateStorageKey)
  } catch {}
}

function getInitialEditorState(): EditorState {
  try {
    return createEditorState(
      JSON.parse(sessionStorage.getItem(joinEditorStateStorageKey)!),
    )
  } catch {
    return createEditorState()
  }
}
