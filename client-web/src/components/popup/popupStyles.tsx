import React from 'react'
import { animated, to as interpolate } from 'react-spring'
import { css } from 'styled-components'

const shadows = {
  default:
    '0 0 15px 100vh rgba(0, 0, 0, 0.02), 0 0 15px 3px rgba(0, 0, 0, 0.03) inset',
  raised: '0 0 10px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05)',
}

export interface PopupCardProps extends React.ComponentProps<'div'> {
  radius?: string
  raised?: boolean
  rounded?: boolean
}

const AnimatedDiv = animated.div as unknown as 'div'

export const AnimatedPopupCard = React.forwardRef<
  HTMLDivElement,
  PopupCardProps
>(({ radius = '3px', raised = true, rounded, ...rest }, ref) => (
  <AnimatedDiv
    ref={ref}
    css={css`
      background-color: white;
      border: 1px solid #f0f0f0;
      box-shadow: ${shadows[raised ? 'raised' : 'default']};
      border-radius: ${radius || (rounded ? 10 : 0) + 'px'};
      position: relative;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &[data-placement*='bottom'],
      &[data-placement*='top'] {
        margin: 0.5rem 0;
      }
      &[data-placement*='left'],
      &[data-placement*='right'] {
        margin: 0 0.5rem;
      }
      top: 0;
      left: 0;
      max-height: 65vh;
      z-index: 1000;
      transform-origin: top center;
      -webkit-overflow-scrolling: touch;
    `}
    {...rest}
  />
))

export const createMergeStyle =
  ({ opacity, top: topOffset }: any) =>
  (
    { left, top, ...popupStyle }: React.CSSProperties = {},
    styleProp?: React.CSSProperties,
  ) => ({
    ...styleProp,
    ...popupStyle,
    opacity,
    transform: interpolate(
      [topOffset],
      (topOffset) =>
        `translate3d(${parseInt(left as string, 10)}px, ${
          parseInt(top as string, 10) + (topOffset as number)
        }px, 0)`,
    ) as any,
  })
