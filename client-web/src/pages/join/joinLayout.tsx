import { css } from '@emotion/react'
import React, { useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import { Boundary } from 'retil-boundary'
import { useHasHydrated } from 'retil-hydration'
import { delay, useEffectOnce } from 'retil-support'
import {
  ColumnTransition,
  useOverrideColumnTransitionHandleRef,
} from 'src/components/columnTransition'

import { Background, BackgroundScene } from 'src/components/background'
import {
  barHeight,
  barWidth,
  largeCardClampWidth,
} from 'src/presentation/dimensions'
import { hideAuthBarEffect } from 'src/services/authBarService'
import {
  useTransitionHandle,
  useTransitionHandleRef,
} from 'src/utils/transitionHandle'

import JoinHeader from './joinHeader'

export interface JoinLayoutProps {
  backgroundScene: BackgroundScene
  children: React.ReactNode
  step: number
}

const headerInStyles = {
  config: {
    friction: 50,
    mass: 1,
    tension: 500,
  },
  opacity: 1,
  transform: `translateY(0%)`,
}
const headerOutStyles = {
  config: {
    clamp: true,
    friction: 15,
    mass: 1,
    tension: 300,
  },
  opacity: 0,
  transform: `translateY(-100%)`,
}

export default function JoinLayout({
  backgroundScene,
  children,
  step,
}: JoinLayoutProps) {
  useEffect(hideAuthBarEffect, [])

  const hasHydrated = useHasHydrated()

  const [headerSpring, headerSpringHandle] = useSpring(() =>
    hasHydrated ? headerOutStyles : headerInStyles,
  )

  const backgroundTransitionHandleRef = useTransitionHandleRef()
  const stepTransitionHandleRef = useTransitionHandleRef()

  useEffectOnce(() => {
    // We don't want to weight down initial pageviews with the background, so
    // we'll need to manually show it once loaded.
    if (!hasHydrated) {
      backgroundTransitionHandleRef.current?.show()
    }
  })

  useTransitionHandle(
    useOverrideColumnTransitionHandleRef(),
    {
      show: async () => {
        Promise.all(headerSpringHandle.start(headerInStyles))
        await delay(100)
        await stepTransitionHandleRef.current?.show()
        return await backgroundTransitionHandleRef.current?.show()
      },
      hide: async () => {
        const fadeBackgroundOut = backgroundTransitionHandleRef.current?.hide()
        stepTransitionHandleRef.current?.hide()
        await delay(100)
        await Promise.all(headerSpringHandle.start(headerOutStyles))
        return await fadeBackgroundOut
      },
    },
    [],
  )

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: center;
      `}>
      <Background
        css={css`
          position: fixed;
          top: 0;
          left: ${barWidth};
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
        `}
        scene={backgroundScene}
        transitionHandleRef={backgroundTransitionHandleRef}
      />
      <div
        css={css`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          max-width: ${largeCardClampWidth};
          width: 100%;
          margin: 0 auto;
          z-index: 1;
        `}>
        <animated.div
          style={headerSpring}
          css={css`
            height: ${barHeight};

            display: flex;
            align-items: center;
          `}>
          <JoinHeader />
        </animated.div>
        <ColumnTransition
          css={css`
            flex-grow: 1;
          `}
          transitionKey={String(step)}
          transitionHandleRef={hasHydrated ? stepTransitionHandleRef : null}>
          <Boundary fallback={<JoinLayoutFallback />}>{children}</Boundary>
        </ColumnTransition>
      </div>
    </div>
  )
}

function JoinLayoutFallback() {
  console.log('render fallback')
  return <div>Loading... (TODO)</div>
}
