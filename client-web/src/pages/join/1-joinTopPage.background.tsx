import { css } from '@emotion/react'
import { animated, useSpring } from 'react-spring'

import { createBackgroundScene } from 'src/components/background'
import { backgroundFadeConfig } from 'src/presentation/springConfigs'
import { useTransitionHandle } from 'src/utils/transitionHandle'

// TODO: maybe move all backgrounds to the assets folder in a single file?
export const backgroundScene = createBackgroundScene(async () => {
  const [{ default: MountainVillage }, { default: SailingShips }] =
    await Promise.all([
      import('src/assets/backgrounds/mountain-village.optimized.svg'),
      import('src/assets/backgrounds/sailing-ships.optimized.svg'),
    ])

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
        <MountainVillage
          css={css`
            position: absolute;
            bottom: 0;
            left: 0;
            opacity: 0.1;
            transform: scaleX(-1);
            z-index: 0;
          `}
        />
        <SailingShips
          css={css`
            position: absolute;
            bottom: 0;
            right: -50px;
            width: 100%;
            opacity: 0.1;
            transform: scaleX(-1);
            z-index: 0;
          `}
        />
      </animated.div>
    )
  }
})
