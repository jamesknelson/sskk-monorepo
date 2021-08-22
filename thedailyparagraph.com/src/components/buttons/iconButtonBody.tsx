import React, { forwardRef } from 'react'
import { HighStyleValue, highStyle } from 'retil-css'
import styled, { css } from 'styled-components'

import { Icon } from 'src/components/icon'
import { colors, easings, focusRing } from 'src/theme'
import { inDisabledSurface } from 'retil-interaction'

export interface IconButtonProps {
  color?: HighStyleValue<string>
  glyph: React.ComponentType<any>
  outline?: HighStyleValue<string>
  size?: HighStyleValue<string | number>
}

export const IconButtonBody = forwardRef<HTMLDivElement, IconButtonProps>(
  (
    {
      color = colors.control.icon.default,
      glyph,
      outline,
      size = '1.5rem',
      ...rest
    },
    ref,
  ) => {
    if (outline && typeof outline !== 'string') {
      outline = color
    }
    return (
      <StyledIconButton ref={ref} {...rest} outline={highStyle(outline)}>
        <Icon color={color} glyph={glyph} size={size} />
      </StyledIconButton>
    )
  },
)

interface StyledIconButtonProps {
  inline?: boolean
  outline?: string
}

const StyledIconButton = styled.div<StyledIconButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  align-items: center;
  background-color: transparent;
  cursor: pointer;
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 300ms ${easings.easeOut}, opacity 200ms ${easings.easeOut},
    text-shadow 200ms ${easings.easeOut};
  min-width: 2.5rem;
  min-height: 2.5rem;

  ${(props) =>
    props.outline &&
    css`
      border: 1px solid ${props.outline};
      border-radius: 9999px;
    `}

  > * {
    position: relative;
  }

  ${focusRing('> *::after', { radius: '9999px', padding: '0.625rem' })}

  ${inDisabledSurface(css`
    cursor: default;
    opacity: 0.5;
  `)}
`
