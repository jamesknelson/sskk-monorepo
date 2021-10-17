import { createContext, useContext } from 'react'

import { TransitionHandleRef } from 'src/utils/transitionHandle'

export const overrideColumnTransitionHandleRefContext =
  createContext<null | TransitionHandleRef>(null)

export function useOverrideColumnTransitionHandleRef() {
  return useContext(overrideColumnTransitionHandleRefContext)
}
