import * as React from 'react'
import { createContext, useContext, useEffect, useRef } from 'react'
import {
  createState,
  // FIXME: using modern useSource crashes the app due to an experimental
  // React tearing heisenbug
  useSourceLegacy as useSource,
} from 'retil-source'

export const [hasHydratedSource, setHasHydrated] = createState(false)

const HydrationContext = createContext<{
  hasChildHydrationBoundaries: boolean
}>({
  hasChildHydrationBoundaries: false,
})

export function useHasHydrated() {
  return useSource(hasHydratedSource)
}

export interface HydrationBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactElement | null
}

export const HydrationBoundary = React.memo((props: HydrationBoundaryProps) => {
  const hydrationContext = useContext(HydrationContext)

  hydrationContext.hasChildHydrationBoundaries = true

  return (
    <React.Suspense fallback={props.fallback || null}>
      <InnerHydrationBoundary children={props.children} />
    </React.Suspense>
  )
})

interface InnerHydrationBoundaryProps {
  children: React.ReactNode
}

const InnerHydrationBoundary = React.memo<InnerHydrationBoundaryProps>(
  ({ children }) => {
    const { current: context } = useRef({
      hasChildHydrationBoundaries: false,
    })

    useEffect(() => {
      if (!context.hasChildHydrationBoundaries) {
        setHasHydrated(true)
      }
    }, [])

    return (
      <HydrationContext.Provider value={context}>
        {children}
      </HydrationContext.Provider>
    )
  },
)
