import { createContext, useContext } from 'react'

import type { TransitionHandleRef } from 'src/utils/transitionHandle'

/**
 * Allows an element to provide methods to transition itself in and out,
 * typically overriding any default transition provided by its ancestors.
 */
export const transitionHandleRefContext =
  createContext<null | TransitionHandleRef>(null)

export function useTransitionHandleRefContext() {
  return useContext(transitionHandleRefContext)
}
