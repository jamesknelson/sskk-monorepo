import { css } from '@emotion/react'
import { animated, useSpring } from 'react-spring'
import { useHasHydrated } from 'retil-hydration'

import { ActivityIndicatorSpinner } from 'src/components/web/indicator/activityIndicatorSpinner'
import {
  TransitionHandleRef,
  useTransitionHandle,
} from 'src/utils/transitionHandle'

export interface LayoutLoadingSpinnerProps {
  transitionHandleRef?: TransitionHandleRef
}

export function LayoutLoadingSpinner({
  transitionHandleRef,
}: LayoutLoadingSpinnerProps) {
  const hasHydrated = useHasHydrated()
  const [spring, api] = useSpring(() => ({
    opacity: hasHydrated ? 0 : 1,
  }))

  useTransitionHandle(
    transitionHandleRef,
    {
      show: () =>
        api.start({
          opacity: 1,
        }),
      hide: async () => {
        // Don't return the promise, as we don't want to wait to fade in
        // the content we're loading.
        api.start({
          opacity: 0,
        })
      },
    },
    [api.start],
  )

  return (
    <animated.div
      style={spring}
      css={css`
        position: fixed;
        height: 4rem;
        width: 4rem;
        top: calc(50% - 2rem);
        left: calc(50% - 2rem);
        margin: 0 auto;
      `}>
      <ActivityIndicatorSpinner color={(theme) => theme.color.primaryWash} />
    </animated.div>
  )
}
