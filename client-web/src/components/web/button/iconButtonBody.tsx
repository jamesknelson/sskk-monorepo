import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { forwardRef } from 'react'
import { HighStyleValue } from 'retil-css'
import { inDisabledSurface } from 'retil-interaction'

import { Icon } from 'src/components/web/icon'
import { easeOut } from 'src/style/easings'
import { Theme } from 'src/types'

export interface IconButtonProps {
  color?: HighStyleValue<string, Theme>
  glyph: React.ComponentType<any>
  label: string | null
  size?: HighStyleValue<string | number, Theme>
}

export const IconButtonBody = forwardRef<HTMLDivElement, IconButtonProps>(
  ({ color = 'currentColor', glyph, label, size = '1.5rem', ...rest }, ref) => {
    return (
      <StyledIconButton ref={ref} {...rest}>
        <Icon color={color} glyph={glyph} size={size} label={label} />
      </StyledIconButton>
    )
  },
)

interface StyledIconButtonProps {
  inline?: boolean
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
  transition: color 300ms ${easeOut}, opacity 200ms ${easeOut},
    text-shadow 200ms ${easeOut};
  min-width: 2.5rem;
  min-height: 2.5rem;

  ${inDisabledSurface(css`
    cursor: default;
    opacity: 0.5;
  `)}
`