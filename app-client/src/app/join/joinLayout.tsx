import { css } from '@emotion/react'
import React, { useMemo } from 'react'
import { animated, useSpring } from 'react-spring'
import { Boundary } from 'retil-boundary'
import { useHasHydrated } from 'retil-hydration'
import { delay, useEffectOnce } from 'retil-support'
import {
  ColumnTransition,
  useTransitionHandleRefContext,
  useTransitionHandle,
  useTransitionHandleRef,
} from 'retil-transition'

import { Background, BackgroundScene } from 'lib-ui-web/component/background'
import { barWidth, largeColumnClampWidth } from 'lib-ui-web/style/dimensions'

import { useHideAuthBarEffect } from '~/service/authBarService'

import JoinHeader from './joinHeader'

export interface JoinLayoutProps {
  backgroundScene: BackgroundScene
  children: React.ReactNode
  transitionKey: string
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
  transitionKey,
}: JoinLayoutProps) {
  useHideAuthBarEffect()

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
    useTransitionHandleRefContext(),
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
          max-width: ${largeColumnClampWidth};
          width: 100%;
          margin: 0 auto;
        `}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            z-index: 2;
          `}>
          <animated.div
            style={headerSpring}
            css={css`
              display: flex;
              align-items: center;
            `}>
            <JoinHeader />
          </animated.div>
        </div>
        <ColumnTransition
          css={css`
            flex-grow: 1;
            z-index: 1;
          `}
          transitionKey={String(transitionKey)}
          transitionHandleRef={hasHydrated ? stepTransitionHandleRef : null}>
          {useMemo(
            () => (
              <Boundary fallback={<JoinLayoutFallback />}>{children}</Boundary>
            ),
            [children],
          )}
        </ColumnTransition>
      </div>
    </div>
  )
}

function JoinLayoutFallback() {
  console.warn('rendering join layout fallback')
  return <div>Loading... (TODO)</div>
}
