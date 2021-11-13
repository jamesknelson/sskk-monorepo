import { css } from '@emotion/react'
import { Placement } from '@popperjs/core'
import { forwardRef } from 'react'
import { animated, useSpring } from 'react-spring'

import { standardRadius } from 'src/style/radii'
import {
  TransitionHandle,
  useTransitionHandle,
} from 'src/utils/transitionHandle'

export type { Placement }

const fromStyles = { opacity: 0, transform: 'scale(0.5) translateY(0%)' }
const enterStyles = {
  opacity: 1,
  transform: 'scale(1) translateY(0%)',
  config: { tension: 300, friction: 15 },
}
const exitStyles = {
  opacity: 0,
  transform: 'scale(1) translateY(-50%)',
  config: { tension: 300, friction: 15, clamp: true },
}

export interface TooltipBodyProps {
  children: React.ReactElement | string
  escaped?: boolean
  placement?: Placement
  referenceHidden?: boolean
  transitionHandleRef?: React.Ref<TransitionHandle>
}

export const TooltipBody = forwardRef<HTMLDivElement, TooltipBodyProps>(
  (props, refProp) => {
    const { children } = props

    const [spring, api] = useSpring(() => fromStyles)

    useTransitionHandle(
      props.transitionHandleRef,
      {
        show: () =>
          api.start({
            ...enterStyles,
            from: fromStyles,
          }),
        hide: () => api.start(exitStyles),
      },
      [api.start],
    )

    return (
      <animated.div
        style={spring}
        ref={refProp}
        css={css`
          padding: 0.25rem 0.75rem;
          border-radius: ${standardRadius};

          background-color: ${paletteColors.ink700};
          color: ${paletteColors.ink050};
          font-family: sans-serif;
          font-size: 15px;
          font-weight: 500;
        `}>
        {children}
      </animated.div>
    )
  },
)
