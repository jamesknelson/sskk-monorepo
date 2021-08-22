import { rgba } from 'polished'
import React, { forwardRef } from 'react'
import {
  animated,
  useSpring,
  useTransition,
  to as interpolate,
} from 'react-spring'
import styled, { css } from 'styled-components'

import { Icon } from 'src/components/icon'
import { LoadingSpinner } from 'src/components/loading'
import { colors, easings, focusRing, media } from 'src/theme'

const StyledButtonGlyph = styled.div`
  position: absolute;
  left: 0rem;
`

const AnimatedStyledButtonGlyph = animated(StyledButtonGlyph)

const StyledButtonLabel = styled.span`
  flex-grow: 1;
`

const AnimatedStyledButtonLabel = animated(StyledButtonLabel)

interface StyledButtonBaseProps {
  inline?: boolean
  leaveGlyphSpace?: boolean
  size?: 'small'
}

const StyledButtonBase = styled.button<StyledButtonBaseProps>`
  align-items: center;
  border-radius: 9999px;
  cursor: pointer;
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  font-family: sans-serif;
  font-weight: 500;
  padding: 0
    ${(props) =>
      props.leaveGlyphSpace
        ? props.size === 'small'
          ? '1.25rem'
          : '1.825rem'
        : '1rem'};
  position: relative;
  text-align: center;
  text-decoration: none;
  /* text-transform: uppercase; */
  transition: opacity 200ms ${easings.easeOut},
    text-shadow 200ms ${easings.easeOut}, box-shadow 200ms ${easings.easeOut},
    color 200ms ${easings.easeOut};
  white-space: nowrap;

  ${focusRing('::after', { radius: '9999px' })}

  ${(props) =>
    props.size === 'small'
      ? css`
          font-size: 11px;
          height: 1.5rem;
          line-height: 1.5rem;
        `
      : css`
          font-size: 0.9rem;
          height: 2rem;

          ${media.phoneOnly`
            height: 1.75rem
          `}
        `}

  ${(props) =>
    props.disabled &&
    css`
      cursor: default;
      opacity: 0.5;
    `}
`

const StyledOutlineButton = styled(StyledButtonBase)<{ color: string }>`
  background-color: transparent;
  ${(props) =>
    props.disabled
      ? css`
        box-shadow: 0 0 0 1px ${props.color} inset
        color: ${props.color};
      `
      : css`
          box-shadow: 0 0 0 1px ${props.color} inset,
            0 0 10px ${rgba(props.color, 0.12)},
            0 0 10px ${rgba(props.color, 0.12)} inset;
          color: ${props.color};
          text-shadow: 0 0 5px ${rgba(props.color, 0.1)};

          :active {
            box-shadow: 0 0 0 1px ${props.color} inset,
              0 0 15px ${rgba(props.color, 0.2)},
              0 0 15px ${rgba(props.color, 0.2)} inset;
            text-shadow: 0 0 8px ${rgba(props.color, 0.15)};
          }
        `}
`

const StyledSolidButton = styled(StyledButtonBase)`
  ${(props) => css`
    background-color: ${props.color};
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2),
      1px 1px 1px rgba(255, 255, 255, 0.12) inset,
      -1px -1px 1px rgba(0, 0, 0, 0.08) inset;
    color: ${colors.text.light};
    :active {
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.08),
        -1px -1px 1px rgba(255, 255, 255, 0.2) inset,
        1px 1px 1px rgba(0, 0, 0, 0.1) inset;
    }
  `}
`

const StyledTextButton = styled(StyledButtonBase)`
  ${(props) => css`
    background-color: transparent;
    color: ${props.color};
    font-weight: 600;
  `}
`

export interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  busy?: boolean
  color?: string
  glyph?: 'busy' | React.ComponentType<any>
  glyphColor?: string
  spinnerColor?: string
  inline?: boolean
  outline?: boolean
  size?: 'small'
  text?: boolean
}

export const ButtonBody = forwardRef<HTMLDivElement, ButtonProps>(
  (
    {
      busy,
      children,
      color = colors.ink.black,
      glyph,
      glyphColor,
      spinnerColor,
      inline = false,
      outline = false,
      text = false,
      ...props
    },
    ref,
  ) => {
    let StyledButton = outline
      ? StyledOutlineButton
      : text
      ? StyledTextButton
      : StyledSolidButton

    if (!glyphColor) {
      glyphColor = outline
        ? rgba(color, 0.85)
        : text
        ? colors.control.icon.default
        : colors.structure.bg
    }
    if (!spinnerColor) {
      spinnerColor = glyphColor
    }
    if (busy) {
      glyph = 'busy'
    }

    let glyphTransitions = useTransition(glyph, {
      config: {
        friction: 5,
        mass: 0.1,
        tension: 50,
      },
      initial: { t: 1 },
      from: { t: 0 },
      enter: { t: 1 },
      leave: { t: 0 },
    })
    let labelStyleSpring = useSpring({
      to: {
        transform: glyph
          ? 'translateX(' + (props.size === 'small' ? 0.625 : 0.75) + 'rem)'
          : 'translateX(0rem)',
      },
    })

    return (
      <StyledButton
        color={color}
        inline={inline}
        leaveGlyphSpace={busy !== undefined || glyph !== undefined}
        ref={ref}
        {...(props as any)}>
        {glyphTransitions(
          ({ t }, item, { key }) =>
            item && (
              <AnimatedStyledButtonGlyph
                key={key}
                style={{
                  transform: interpolate(
                    [t],
                    (t: number) =>
                      `translateX(${props.size === 'small' ? 0.5 * t : t}rem)`,
                  ),
                  opacity: t,
                }}>
                {item === 'busy' ? (
                  <LoadingSpinner
                    color={spinnerColor}
                    backgroundColor={outline ? colors.structure.bg : color}
                    size="1rem"
                    active
                  />
                ) : (
                  <Icon
                    color={glyphColor}
                    display="block"
                    size="1rem"
                    glyph={item}
                  />
                )}
              </AnimatedStyledButtonGlyph>
            ),
        )}
        <AnimatedStyledButtonLabel style={labelStyleSpring}>
          {children}
        </AnimatedStyledButtonLabel>
      </StyledButton>
    )
  },
)
