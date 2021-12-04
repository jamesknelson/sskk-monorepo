import { TransitionHandleRef } from 'src/utils/transitionHandle'

/**
 * A background will fade in once loaded, instead of blocking rendering
 * of other components. It can be preloaded to improve load times.
 *
 * If a transitionHandleRef is passed to the background component, then
 * any fade in will not occur until `show` has been called. However, if
 * the background is not yet ready when `show` is called, then the background
 * will fade in immediately after load.
 */

export type BackgroundSceneLoader = () => Promise<BackgroundSceneComponent>

// Background scenes are defined as a component that accepts a transition
// handle, so that they may define their own intro/outro animations, and
// so that they may store state and define animations.
export type BackgroundSceneComponent = (
  props: BackgroundSceneProps,
) => React.ReactElement

export interface BackgroundSceneProps {
  transitionHandleRef: TransitionHandleRef
}

export interface BackgroundSceneCache {
  promise?: Promise<void>
  result?:
    | {
        type: 'component'
        value: BackgroundSceneComponent
      }
    | {
        type: 'error'
        value: unknown
      }
}

export interface BackgroundScene {
  cache: BackgroundSceneCache
  load: () => Promise<void>
}

export function createBackgroundScene(
  loader: BackgroundSceneLoader,
): BackgroundScene {
  const cache: BackgroundSceneCache = {}

  const load: () => Promise<void> = async () => {
    if (!cache.promise) {
      cache.promise = loader().then(
        (component) => {
          cache.result = { type: 'component', value: component }
        },
        (error) => {
          cache.result = { type: 'error', value: error }
        },
      )
    }
    return cache.promise
  }

  return {
    cache,
    load,
  }
}
