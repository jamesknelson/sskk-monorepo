import React from 'react'
import { animated, useTrail } from 'react-spring'
import { useHasHydrated } from 'retil-hydration'
import { TransitionHandle, useTransitionHandle } from 'retil-transition'

export interface SpringTrailColumnProps {
  children: React.ReactElement[]
  transitionHandleRef: React.Ref<TransitionHandle>
}

const fromStyles = {
  opacity: 0,
  transform: 'translateY(-5vh)',
}
const enterStyles = {
  config: {
    friction: 50,
    mass: 1,
    tension: 500,
  },
  opacity: 1,
  transform: 'translateY(0vh)',
}
const exitStyles = {
  config: {
    clamp: true,
    friction: 15,
    mass: 1,
    tension: 300,
  },
  opacity: 0,
  transform: 'translateY(5vh)',
}

export function SpringTrailColumn({
  children,
  transitionHandleRef,
}: SpringTrailColumnProps) {
  const hasHydrated = useHasHydrated()

  const items = React.Children.toArray(children)
  const [trail, api] = useTrail(items.length, () => ({
    ...(!hasHydrated ? enterStyles : fromStyles),
  }))

  useTransitionHandle(
    transitionHandleRef,
    {
      show: async () =>
        api.start({
          ...enterStyles,
          from: fromStyles,
        }),
      hide: async () => api.start(exitStyles),
    },
    [api.start],
  )

  return (
    <>
      {trail.reverse().map((spring, index) => (
        //@ts-ignore
        <animated.div key={index} style={spring}>
          {items[index]}
        </animated.div>
      ))}
    </>
  )
}
