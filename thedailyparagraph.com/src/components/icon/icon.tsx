import React from 'react'
import styled, { css } from 'styled-components'

import { colors } from 'src/theme'

const DEFAULT_ICON_SIZE = '24px'

export type IconProps = React.ComponentProps<typeof StyledIconContainer> & {
  display?: string
  glyph: React.ComponentType<any>
  label: string | null
  size?: number | string
  color?: string
  testID?: string
  transform?: string
}

interface StyledIconContainerProps {
  display: string
  size: string
}

function addDefaultRemUnits(value: number | string): string {
  return typeof value === 'number' ? value + 'rem' : value
}

const StyledIconContainer = styled.span<StyledIconContainerProps>`
  display: ${(props) => props.display};
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  text-align: center;
`

interface StyledIconProps {
  size: string
}

const StyledIcon = styled.span<StyledIconProps>`
  display: block;
  margin: 0 auto;
  height: ${(props) => props.size};
  width: ${(props) => props.size};

  ${(props) =>
    props.color &&
    css`
      fill: ${props.color};
    `}
`

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      display = 'inline-block',
      glyph,
      label,
      size = DEFAULT_ICON_SIZE,
      color = colors.control.icon.default,
      testID,
      transform,
      ...props
    },
    ref,
  ) => {
    size = addDefaultRemUnits(size)

    return (
      <StyledIconContainer ref={ref} display={display} size={size} {...props}>
        <StyledIcon
          size={size}
          color={color}
          data-testid={testID}
          as={glyph}
          role="img"
          title={label}
          style={{ transform }}
          aria-label={label}
        />
      </StyledIconContainer>
    )
  },
)
