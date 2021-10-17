import { css } from '@emotion/react'
import { rgba } from 'polished'
import type React from 'react'
import { forwardRef } from 'react'
import {
  animated,
  useSpring,
  useTransition,
  to as interpolate,
} from 'react-spring'
import { highStyle } from 'retil-css'
import { inDisabledSurface } from 'retil-interaction'
import { KeyPartitioner, partitionByKeys } from 'retil-support'

import { ChevronRight } from 'src/assets/glyphs'

// import { Caret } from './caret'
import { controlColors, paletteColors, textColors } from './colors'
import { easeOut } from './easings'
import { GlyphComponent, Icon } from './icon'
import { LoadingSpinner } from './loadingSpinner'

// FIXME: there's a vite bug where putting this directly into the defaults via
// destructuring causes it to be undefined during server rendering in some
// cases, which in turn causes some pages to briefly show the loading page
// on the client after initial load. For some reason.
const defaultRaisedColor = paletteColors.ink900
const defaultOutlineColor = paletteColors.ink900

const buttonBodyBaseStyles = [
  css`
    align-items: center;
    border-radius: 9999px;
    cursor: pointer;
    display: flex;
    font-family: sans-serif;
    font-weight: 500;
    padding: 0 1rem;
    position: relative;
    text-align: center;
    text-decoration: none;
    transition: opacity 200ms ${easeOut}, text-shadow 200ms ${easeOut},
      box-shadow 200ms ${easeOut}, color 200ms ${easeOut};
    white-space: nowrap;

    font-size: 1rem;
    height: 2rem;
  `,
  inDisabledSurface(css`
    cursor: default;
    opacity: 0.5;
  `),
]

type ButtonBodyProps = Omit<JSX.IntrinsicElements['div'], 'children' | 'ref'> &
  Omit<ButtonBodyContentConfig, 'labelColor'> & {
    labelColor?: string
  }

export const OutlineButtonBody = forwardRef<HTMLDivElement, ButtonBodyProps>(
  (
    { color = defaultOutlineColor, labelColor = defaultOutlineColor, ...rest },
    ref,
  ) => (
    <ButtonBodyContent
      {...rest}
      // TODO: allow buttons to be colored by control variant
      glyphColor={controlColors.icon.default}
      labelColor={labelColor}
      ref={ref}
      css={[
        ...buttonBodyBaseStyles,
        css`
          background-color: transparent;
        `,
        // TODO: this should only be applied when *not* disabled
        css`
          box-shadow: 0 0 0 1px ${color} inset, 0 0 10px ${rgba(color, 0.12)},
            0 0 10px ${rgba(color, 0.12)} inset;
          color: ${color};
          text-shadow: 0 0 5px ${rgba(color, 0.1)};

          :active {
            box-shadow: 0 0 0 1px ${color} inset, 0 0 15px ${rgba(color, 0.2)},
              0 0 15px ${rgba(color, 0.2)} inset;
            text-shadow: 0 0 8px ${rgba(color, 0.15)};
          }
        `,
        inDisabledSurface(css`
          box-shadow: 0 0 0 1px ${color} inset;
          color: ${color};
        `),
      ]}
    />
  ),
)

export const RaisedButtonBody = forwardRef<HTMLDivElement, ButtonBodyProps>(
  (
    {
      color = defaultRaisedColor,
      labelColor = 'rgba(255, 255, 255, 0.9)',
      ...rest
    },
    ref,
  ) => (
    <ButtonBodyContent
      {...rest}
      labelColor={labelColor}
      ref={ref}
      css={[
        ...buttonBodyBaseStyles,
        css`
          background-color: ${color};
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2),
            1px 1px 1px rgba(255, 255, 255, 0.12) inset,
            -1px -1px 1px rgba(0, 0, 0, 0.08) inset;
          color: ${textColors.light};
          :active {
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.08),
              -1px -1px 1px rgba(255, 255, 255, 0.2) inset,
              1px 1px 1px rgba(0, 0, 0, 0.1) inset;
          }
        `,
      ]}
    />
  ),
)

export const partitionButtonBodyContentConfig: KeyPartitioner<ButtonBodyContentConfig> =
  (object) =>
    partitionByKeys(
      [
        'caret',
        'caretColor',
        'caretRotationDegrees',
        'chevron',
        'chevronColor',
        'glyph',
        'glyphColor',
        'glyphSide',
        'label',
        'labelColor',
        'showBusyIndicator',
        'showBusyIndicatorColor',
      ],
      object,
    )

export interface ButtonBodyContentConfig {
  caret?: boolean
  caretColor?: string
  caretRotationDegrees?: number
  chevron?: 'left' | 'right' | null
  chevronColor?: string
  glyph?: GlyphComponent | null
  glyphColor?: string
  glyphSide?: 'left' | 'right'
  label: React.ReactElement | string
  labelColor: string
  showBusyIndicator?: boolean
  showBusyIndicatorColor?: string
}

export type ButtonBodyContentProps = ButtonBodyContentConfig &
  JSX.IntrinsicElements['div']

export const ButtonBodyContent = forwardRef<
  HTMLDivElement,
  ButtonBodyContentProps
>((props, ref) => {
  const defaultSymbolColor = props.glyphColor || rgba(props.labelColor, 0.85)

  const {
    showBusyIndicator,
    showBusyIndicatorColor = defaultSymbolColor,
    // caret = false,
    // caretColor,
    chevron = null,
    chevronColor = defaultSymbolColor,
    glyph,
    glyphColor = defaultSymbolColor,
    // glyphSide = 'left',
    label,
    labelColor,
    ...rest
  } = props

  const glyphOrBusyIndicator = (showBusyIndicator ? 'busy' : glyph) || null

  let glyphTransitions = useTransition(glyphOrBusyIndicator, {
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
      transform: `translateX(${glyph ? 1 : 0}em)`,
    },
  })

  return (
    <div
      css={[
        highStyle({
          color: labelColor,
        }),
      ]}
      ref={ref}
      {...rest}>
      {glyphTransitions(
        ({ t }, item, { key }) =>
          item && (
            <AnimatedButtonGlyphWrapper
              key={key}
              style={{
                transform: interpolate(
                  [t],
                  (t: number) => `translateX(${t}em)`,
                ),
                opacity: t,
              }}>
              {item === 'busy' ? (
                <LoadingSpinner
                  color={showBusyIndicatorColor}
                  size="1rem"
                  active
                />
              ) : (
                item && (
                  <Icon
                    color={glyphColor}
                    inline={false}
                    label={null}
                    glyph={item as GlyphComponent}
                  />
                )
              )}
            </AnimatedButtonGlyphWrapper>
          ),
      )}
      <AnimatedButtonLabelWrapper style={labelStyleSpring}>
        {label}
        {chevron === 'right' && (
          <Icon
            color={chevronColor}
            glyph={ChevronRight}
            label={null}
            css={css`
              margin-left: 0.33em;
              margin-right: -0.33em;
            `}
          />
        )}
      </AnimatedButtonLabelWrapper>
    </div>
  )
})

const AnimatedButtonGlyphWrapper: React.FunctionComponent<
  React.ComponentProps<typeof animated.div>
> = (props) => (
  <animated.div
    css={css`
      position: absolute;
      left: 0;
    `}
    {...props}
  />
)

const AnimatedButtonLabelWrapper: React.FunctionComponent<
  React.ComponentProps<typeof animated.span>
> = (props) => (
  <animated.span
    css={css`
      flex-grow: 1;
      display: flex;
      align-items: center;
    `}
    {...props}
  />
)
