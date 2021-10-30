import { css } from '@emotion/react'
import { animated, useSpring } from 'react-spring'
import { useHasHydrated } from 'retil-hydration'
import { LoaderProps } from 'retil-mount'

import { useOverrideColumnTransitionHandleRef } from 'src/components/columnTransition'
import { AppEnv } from 'src/env'
import { paletteColors } from 'src/presentation/colors'
import { LoadingSpinner } from 'src/presentation/loadingSpinner'
import { useTransitionHandle } from 'src/utils/transitionHandle'

export function LoadingPage() {
  const transitionHandleRef = useOverrideColumnTransitionHandleRef()
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
      <LoadingSpinner color={paletteColors.ink100} />
    </animated.div>
  )
}

const loader = (_props: LoaderProps<AppEnv>) => <LoadingPage />

export default loader
