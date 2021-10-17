import { css } from '@emotion/react'
import { animated, useSpring } from 'react-spring'

import { createBackgroundScene } from 'src/components/background'
import { backgroundFadeConfig } from 'src/presentation/springConfigs'
import { useTransitionHandle } from 'src/utils/transitionHandle'

// TODO: maybe move all backgrounds to the assets folder in a single file?
export const backgroundScene = createBackgroundScene(async () => {
  const { default: WinterCabin } = await import(
    'src/assets/backgrounds/winter-cabin.optimized.svg'
  )

  return ({ transitionHandleRef }) => {
    const [spring, api] = useSpring(() => ({
      config: backgroundFadeConfig,
      to: { opacity: 0 },
    }))

    useTransitionHandle(
      transitionHandleRef,
      {
        show: () => api.start({ opacity: 1 }),
        hide: () => api.start({ opacity: 0 }),
      },
      [api.start],
    )

    return (
      <animated.div
        style={spring}
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        `}>
        <WinterCabin
          css={css`
            position: absolute;
            bottom: 0;
            right: 0;
            opacity: 0.1;
            z-index: 0;
            transform: scale(1.5);
            transform-origin: bottom right;
          `}
        />
      </animated.div>
    )
  }
})
