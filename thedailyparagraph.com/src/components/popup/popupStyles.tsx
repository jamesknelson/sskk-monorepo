import React from 'react'
import { animated, to as interpolate } from 'react-spring'
import styled from 'styled-components'

import { colors } from 'src/theme'

import { PopupCard } from './popupCard'

export const PopupArrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;

  &::before,
  &::after {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    position: absolute;
  }
  &::before {
    border-width: 8px;
  }
  &::after {
    border-width: 7px;
  }

  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
    margin-top: -1rem;
    width: 0.5rem;
    height: 0.5rem;
    &::before {
      border-color: transparent transparent ${colors.structure.border}
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: transparent transparent ${colors.structure.bg} transparent;
      z-index: 2;
      margin-left: 1px;
      margin-top: 2px;
    }
  }
  &[data-placement*='top'] {
    bottom: 0;
    left: 0;
    margin-bottom: -0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    &::before {
      border-color: ${colors.structure.border} transparent transparent
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: ${colors.structure.bg} transparent transparent transparent;
      z-index: 2;
      margin-left: 1px;
      margin-bottom: -2px;
    }
  }
  &[data-placement*='right'] {
    top: 0;
    left: 0;
    margin-top: -0.75rem;
    margin-left: -1rem;
    height: 0.5rem;
    width: 0.5rem;
    &::before {
      border-color: transparent ${colors.structure.border} transparent
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: transparent ${colors.structure.bg} transparent transparent;
      z-index: 2;
      margin-top: 1px;
      margin-left: 2px;
    }
  }
  &[data-placement*='left'] {
    top: 0;
    right: -0.5rem;
    margin-top: -0.75rem;
    height: 0.5rem;
    width: 0.5rem;
    &::before {
      border-color: transparent transparent transparent
        ${colors.structure.border};
      z-index: 1;
    }
    &::after {
      border-color: transparent transparent transparent ${colors.structure.bg};
      z-index: 2;
      margin-top: 1px;
      margin-left: 0px;
    }
  }
`

const StyledPopupBox = animated(styled(PopupCard)`
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
`)

type PopupBoxProps = React.ComponentProps<typeof StyledPopupBox> & {
  innerRef?: any
  left?: any
  position?: React.CSSProperties['position']
  top?: any
  transitionProps?: any
}

export const PopupBox = React.forwardRef<HTMLDivElement, PopupBoxProps>(
  (
    {
      transitionProps: { opacity, scale, top: topOffset },
      left,
      top,
      innerRef,
      ...props
    },
    ref,
  ) => (
    <StyledPopupBox
      ref={ref}
      radius="3px"
      raised
      {...props}
      style={{
        opacity: opacity,
        transform: interpolate(
          [scale, topOffset],
          (scale, topOffset) =>
            `translate3d(${left}px, ${top + topOffset}px, 0) scale(${scale})`,
        ),
        position: props.position,
      }}
    />
  ),
)
