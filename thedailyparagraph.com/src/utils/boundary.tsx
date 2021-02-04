/**
 * This system takes advantage of the fact that when the router request changes,
 * components with `useRouterRequest()` will be called in the order of how high
 * in the component tree they are. This allows us to find the deepest boundary
 * instance for a given request, and take actions oncen it is rendered.
 *
 * Note that this isn't factored out into a utility library, as any <Suspense>
 * elements between the app root and content need to be rendered by this tool,
 * so it makes more sense to keep as custom application code than to try and
 * handle all scenarios in a library.
 */

import React, { useMemo } from 'react'
import { createContext, useContext, useEffect, useRef } from 'react'
import { useRouterScroller } from 'retil-router'
import { createState, useSource } from 'retil-source'

export const [hasHydratedSource, setHasHydrated] = createState(false)

interface TRoutingBoundaryContext {
  handledByChild?: object
  handledByParent?: boolean
}

const RoutingBoundaryContext = createContext<TRoutingBoundaryContext>({})

export function useHasHydrated() {
  return useSource(hasHydratedSource)
}

export interface RoutingBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactElement | null
}

export const RoutingBoundary = React.memo((props: RoutingBoundaryProps) => {
  const { children, fallback } = props
  const routingBoundaryContext = useContext(RoutingBoundaryContext)
  const { current: boundaryKey } = useRef({})

  routingBoundaryContext.handledByChild = boundaryKey

  if (process.env.NODE_ENV !== 'production') {
    if (routingBoundaryContext.handledByParent) {
      console.warn(
        'Nested <RoutingBoundary> must not have any <Suspense> tags nested ' +
          'between them. Use another <RoutingBoundary> instead.',
      )
    }

    useEffect(() => {
      if (routingBoundaryContext.handledByChild !== boundaryKey) {
        console.warn(
          'Nesting multiple <RoutingBoundary> elements within a single ' +
            'parent <RoutingBoundary> is not supported.',
        )
      }
    }, [routingBoundaryContext])
  }

  return useMemo(
    () => (
      <React.Suspense
        fallback={<InnerRoutingBoundary children={fallback || null} />}>
        <InnerRoutingBoundary children={children} />
      </React.Suspense>
    ),
    [boundaryKey, fallback, children],
  )
})

interface InnerRoutingBoundaryProps {
  children: React.ReactNode
}

const InnerRoutingBoundary = React.memo<InnerRoutingBoundaryProps>(
  ({ children }) => {
    const hydratedRef = useRef(false)
    const { current: context } = useRef<TRoutingBoundaryContext>({})

    useRouterScroller({
      getWillChildHandleScroll: () => !!context.handledByChild,
    })

    useEffect(() => {
      hydratedRef.current = true

      if (!context.handledByChild) {
        context.handledByParent = true
        setHasHydrated(true)
      }
    }, [])

    return (
      <RoutingBoundaryContext.Provider value={context}>
        {children}
      </RoutingBoundaryContext.Provider>
    )
  },
)
