import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  Source,
  createState,
  // FIXME: using modern useSource crashes the app due to an experimental
  // React tearing heisenbug
  useSourceLegacy as useSource,
} from 'retil-source'

export const HasHydratedSourceContext = createContext<Source<boolean>>(
  createState(false)[0],
)

export function useHasHydrated() {
  return useSource(useContext(HasHydratedSourceContext), {
    defaultValue: false,
  })
}

export interface HydrationBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactElement | null
}

export const HydrationBoundary = React.memo((props: HydrationBoundaryProps) => (
  <React.Suspense fallback={props.fallback || null}>
    <InnerHydrationBoundary children={props.children} />
  </React.Suspense>
))

function InnerHydrationBoundary({ children }: { children: React.ReactNode }) {
  const [[hasHydratedSource, setHydrated]] = useState(() => createState(false))

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <HasHydratedSourceContext.Provider value={hasHydratedSource}>
      {children}
    </HasHydratedSourceContext.Provider>
  )
}
