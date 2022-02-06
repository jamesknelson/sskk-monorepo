import React, { memo, useEffect, useRef, useState } from 'react'
import { useHasHydrated } from 'retil-hydration'
import {
  TransitionHandle,
  useTransitionHandle,
  useTransitionHandleRefContext,
} from 'retil-transition'
import { ColumnTransition } from 'retil-transition'

import { crossfadeTransitionConfig } from '~/style/transitionConfigs'

import { BackgroundScene, BackgroundSceneComponent } from './backgroundScene'

export interface BackgroundProps {
  scene: BackgroundScene | null
  transitionHandleRef?: React.Ref<TransitionHandle>
}

export const Background = memo(function Background({
  scene,
  transitionHandleRef,
  ...rest
}: BackgroundProps &
  Omit<JSX.IntrinsicElements['div'], 'children'>): null | React.ReactElement {
  const hasHydrated = useHasHydrated()
  const [component, setComponent] = useState<BackgroundSceneComponent | null>(
    () =>
      hasHydrated && scene?.cache.result?.type === 'component'
        ? scene.cache.result.value
        : null,
  )
  const childTransitionHandleRef = useRef<TransitionHandle | null>(null)
  const shownRef = useRef(!hasHydrated)

  // Don't show the background until it's loaded, and `show` has been called on
  // our transition handle (if a ref was supplied).
  useTransitionHandle(
    transitionHandleRef,
    {
      show: async () => {
        const previouslyShown = shownRef.current
        shownRef.current = true
        if (
          !previouslyShown &&
          scene?.cache.result?.type === 'component' &&
          childTransitionHandleRef.current
        ) {
          return childTransitionHandleRef.current.show()
        }
      },
      hide: async () => {
        shownRef.current = false
        if (childTransitionHandleRef.current) {
          return childTransitionHandleRef.current.hide()
        }
      },
    },
    [],
  )

  useEffect(() => {
    if (hasHydrated && scene) {
      const { load, cache } = scene
      load().then(() => {
        if (cache.result?.type === 'component') {
          const component = cache.result.value
          setComponent(() => component)
        }
      })
    } else {
      setComponent(null)
    }
  }, [hasHydrated, scene])

  useEffect(() => {
    if (component && transitionHandleRef && shownRef.current) {
      childTransitionHandleRef.current?.show()
    }
  }, [component, transitionHandleRef])

  return (
    <ColumnTransition
      transitionConfig={crossfadeTransitionConfig}
      transitionKey={component}
      transitionHandleRef={childTransitionHandleRef}
      {...rest}>
      {component && <InnerBackground component={component} />}
    </ColumnTransition>
  )
})

interface InnerBackgroundProps {
  component: BackgroundSceneComponent
}

function InnerBackground({ component: Component }: InnerBackgroundProps) {
  const transitionHandleRef = useTransitionHandleRefContext()
  return <Component transitionHandleRef={transitionHandleRef} />
}
