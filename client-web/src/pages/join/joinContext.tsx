import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { useNavController } from 'retil-nav'

import { JoinPersistence } from './joinPersistence'

const joinContext = createContext<JoinSnapshot>(null as any)

export type JoinPath = keyof typeof import('./joinURLs')['default']

export interface JoinSnapshot extends JoinState {
  persistence: JoinPersistence
}

export function useJoinContext() {
  return useContext(joinContext)
}

export interface JoinProviderProps {
  children: React.ReactNode
  mountPath: string
  path: JoinPath
  persistence: JoinPersistence
}

export function JoinProvider(props: JoinProviderProps) {
  const { children, mountPath, path, persistence } = props
  const navController = useNavController()
  const [state, dispatch] = useReducer(joinReducer, {
    // TODO: if logged in, set to 2 or more
    completedSteps:
      path === 'createAccount' ? 2 : path === 'writeIntroLetter' ? 1 : 0,
    path,
  })

  const snapshot = useMemo<JoinSnapshot>(
    () => ({
      persistence,
      ...state,
    }),
    [persistence, state],
  )

  useEffect(() => {
    if (snapshot.path !== path) {
      dispatch({ type: 'setPath', path })
    }
  }, [path, snapshot.path])

  useEffect(
    () => persistence.block(mountPath, navController),
    [mountPath, navController, persistence],
  )

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
