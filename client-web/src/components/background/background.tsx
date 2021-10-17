import React, { useEffect, useState, useRef } from 'react'
import { useHasHydrated } from 'retil-hydration'

import {
  ColumnTransition,
  useOverrideColumnTransitionHandleRef,
} from 'src/components/columnTransition'
import { backgroundFadeConfig } from 'src/presentation/springConfigs'
import {
  TransitionHandle,
  useTransitionHandle,
} from 'src/utils/transitionHandle'

import { BackgroundScene, BackgroundSceneComponent } from './backgroundScene'

export interface BackgroundProps {
  scene: BackgroundScene | null
  transitionHandleRef?: React.Ref<TransitionHandle>
}

const defaultInitialTransition = {
  opacity: 0,
}
const defaultFromTransition = {
  opacity: 0,
}
const defaultEnterTransition = {
  opacity: 1,
  config: backgroundFadeConfig,
}
const defaultExitTransition = {
  opacity: 0,
  config: backgroundFadeConfig,
}

export function Background({
  scene,
  transitionHandleRef,
  ...rest
}: BackgroundProps &
  Omit<JSX.IntrinsicElements['div'], 'children'>): null | React.ReactElement {
  const [component, setComponent] = useState<BackgroundSceneComponent | null>(
    () =>
      scene?.cache.result?.type === 'component'
        ? scene.cache.result.value
        : null,
  )
  const childTransitionHandleRef = useRef<TransitionHandle | null>(null)
  const hasHydrated = useHasHydrated()
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
    if (scene) {
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
  }, [scene])

  useEffect(() => {
    if (component && transitionHandleRef && shownRef.current) {
      childTransitionHandleRef.current?.show()
    }
  }, [component, transitionHandleRef])

  return (
    <ColumnTransition
      initial={defaultInitialTransition}
      from={defaultFromTransition}
      enter={defaultEnterTransition}
      exit={defaultExitTransition}
      transitionKey={component}
      transitionHandleRef={childTransitionHandleRef}
      {...rest}>
      {component && <InnerBackground component={component} />}
    </ColumnTransition>
  )
}

interface InnerBackgroundProps {
  component: BackgroundSceneComponent
}

function InnerBackground({ component: Component }: InnerBackgroundProps) {
  const transitionHandleRef = useOverrideColumnTransitionHandleRef()
  return <Component transitionHandleRef={transitionHandleRef} />
}
