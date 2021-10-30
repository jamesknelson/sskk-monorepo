import { css } from '@emotion/react'
import { Interpolation } from '@emotion/serialize'
import { rgba, tint } from 'polished'
import type React from 'react'
import { forwardRef } from 'react'
import { animated, useTransition } from 'react-spring'
import { HighStyleValue, highStyle } from 'retil-css'
import { inActiveSurface, inDisabledSurface } from 'retil-interaction'

import { ChevronLeft, ChevronRight } from 'src/assets/glyphs'
import { Caret } from './caret'

// import { Caret } from './caret'
import { controlColors, paletteColors } from './colors'
import { easeInOut, easeOut } from './easings'
import { GlyphComponent, Icon } from './icon'
import { InteractionRingDiv } from './interactionRing'
import { LoadingSpinner } from './loadingSpinner'
import { ProgressCircle } from './progressCircle'

// FIXME: there's a vite bug where putting this directly into the defaults via
// destructuring causes it to be undefined during server rendering in some
// cases, which in turn causes some pages to briefly show the loading page
// on the client after initial load. For some reason.
const defaultRaisedColor = paletteColors.ink900
const defaultOutlineColor = paletteColors.ink900

type ButtonBodyProps = Omit<JSX.IntrinsicElements['div'], 'children' | 'ref'> &
  Omit<ButtonBodyContentConfig, 'labelColor'> & {
    labelColor?: string
  }

export const OutlineButtonBody = forwardRef<HTMLDivElement, ButtonBodyProps>(
  (
    { color = defaultOutlineColor, labelColor = defaultOutlineColor, ...rest },
    ref,
  ) => (
    <ButtonBody
      {...rest}
      ref={ref}
      glyphColor={controlColors.icon.default}
      themeCSS={[
        // TODO: this should only be applied when *not* disabled
        css`
          box-shadow: 0 0 0 1px ${color} inset, 0 0 10px ${rgba(color, 0.12)},
            0 0 10px ${rgba(color, 0.12)} inset;
          text-shadow: 0 0 5px ${rgba(color, 0.1)};
        `,
        highStyle({
          color: labelColor,
        }),
        inActiveSurface(css`
          box-shadow: 0 0 0 1px ${color} inset, 0 0 15px ${rgba(color, 0.2)},
            0 0 15px ${rgba(color, 0.2)} inset;
          text-shadow: 0 0 8px ${rgba(color, 0.15)};
        `),
        inDisabledSurface(
          // TODO: handle progress circles as well
          !rest.busyIndicator &&
            css`
              box-shadow: 0 0 0 1px ${color} inset;
              opacity: 0.5;
            `,
        ),
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
    <ButtonBody
      {...rest}
      ref={ref}
      glyphColor={rgba(labelColor, 0.85)}
      themeCSS={[
        highStyle({
          backgroundColor: {
            default: color,
            [inDisabledSurface]: tint(0.5, color),
          },
          color: labelColor,
        }),
        css`
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2),
            1px 1px 1px rgba(255, 255, 255, 0.12) inset,
            -1px -1px 1px rgba(0, 0, 0, 0.08) inset;
        `,
        inActiveSurface(css`
          box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.08),
            -1px -1px 1px rgba(255, 255, 255, 0.2) inset,
            1px 1px 1px rgba(0, 0, 0, 0.1) inset;
        `),
      ]}
    />
  ),
)

// - A function will be rendered as an icon
// - An element will be rendered as-is
// - A number will be rendered as a progress circle
// - `null` will be rendered as extra space
// - `undefined` will cause nothing to be rendered
export type ButtonBodyGlyphProp =
  | GlyphComponent
  | React.ReactElement
  | 'caret'
  | 'chevron'
  | 'spinner'
  | number
  | null

// TODO:
// - allow a `labelColor` high style value to be passed in, and compute the
//   default glyph color from this.
export interface ButtonBodyContentConfig {
  // Supplying `true` to `busyIndicator` will replace the rest of the content
  // with a busy indicator, while 'above' and 'below' can be used to animate
  // the indiator in and out.
  busyIndicator?: 'above' | 'below' | true
  busyIndicatorColor?: HighStyleValue<string>
  glyphColor?: HighStyleValue<string>
  inline?: boolean
  label: React.ReactElement | string
  leftGlyph?: ButtonBodyGlyphProp
  leftGlyphScale?: number
  leftGlyphColor?: HighStyleValue<string>
  lowProfile?: boolean
  rightGlyph?: ButtonBodyGlyphProp
  rightGlyphColor?: HighStyleValue<string>
  rightGlyphScale?: number
  themeCSS?: Interpolation<any>
}

export type ButtonBodyContentProps = ButtonBodyContentConfig &
  JSX.IntrinsicElements['div']

export const ButtonBody = forwardRef<HTMLDivElement, ButtonBodyContentProps>(
  (props, ref) => {
    const defaultSymbolColor = 'currentColor'

    const {
      busyIndicator,
      busyIndicatorColor = defaultSymbolColor,
      glyphColor = defaultSymbolColor,
      inline = false,
      label,
      leftGlyph,
      leftGlyphColor = glyphColor,
      leftGlyphScale = 1,
      lowProfile = false,
      rightGlyph,
      rightGlyphColor = glyphColor,
      rightGlyphScale = 1,
      themeCSS,
      ...rest
    } = props

    return (
      <InteractionRingDiv
        inline={inline}
        css={[
          css`
            cursor: pointer;
          `,
          busyIndicator === true &&
            css`
              cursor: progress;
            `,
          inDisabledSurface(
            css`
              cursor: default;
            `,
            busyIndicator === true &&
              css`
                cursor: wait;
              `,
          ),
        ]}
        ref={ref}
        {...rest}>
        <div
          css={[
            themeCSS,
            css`
              position: relative;
              flex-grow: 1;

              display: flex;
              overflow: hidden;

              border-radius: 9999px;

              transition: background-color 200ms ${easeOut},
                opacity 250ms ${easeOut}, text-shadow 250ms ${easeOut},
                box-shadow 250ms ${easeOut}, color 250ms ${easeOut};
            `,
          ]}>
          <div
            css={[
              css`
                flex-grow: 1;

                display: flex;
                align-items: center;
                flex-direction: column;

                transform: translateY(
                  ${busyIndicator === true
                    ? '-100%'
                    : busyIndicator === 'below'
                    ? 0
                    : '-200%'}
                );
                transition: transform 250ms ${easeInOut};
              `,
            ]}>
            {busyIndicator && (
              <div
                css={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;

                  display: flex;
                  align-items: center;
                  justify-content: center;

                  transform: translateY(100%);
                `}>
                <LoadingSpinner color={busyIndicatorColor} size="1rem" active />
              </div>
            )}
            <div
              css={[
                css`
                  flex-grow: 1;

                  display: flex;
                  align-items: center;

                  padding: ${lowProfile ? 0.25 : 0.5}rem 1rem;
                  line-height: 1.5rem;

                  font-family: sans-serif;
                  font-weight: 500;
                  font-size: 1rem;
                  text-align: center;
                  white-space: nowrap;

                  transform: translateY(
                    ${busyIndicator === 'below' ? 0 : '200%'}
                  );
                `,
              ]}>
              {leftGlyph !== undefined && (
                <ButtonBodyGlyph
                  color={leftGlyphColor}
                  scale={leftGlyphScale}
                  side="Left"
                  value={leftGlyph}
                />
              )}
              <div
                css={css`
                  flex-grow: 1;

                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}>
                {label}
              </div>
              {rightGlyph !== undefined && (
                <ButtonBodyGlyph
                  color={rightGlyphColor}
                  scale={rightGlyphScale}
                  side="Right"
                  value={rightGlyph}
                />
              )}
            </div>
          </div>
        </div>
      </InteractionRingDiv>
    )
  },
)

interface ButtonBodyGlyphProps {
  color: HighStyleValue<string>
  scale?: number
  side: 'Left' | 'Right'
  value: ButtonBodyGlyphProp
}

const glyphFrom = {
  opacity: 0,
  transform: 'translateX(-50%)',
}
const glyphIn = {
  opacity: 1,
  transform: 'translateX(0%)',
}
const glyphExit = {
  opacity: 0,
  transform: 'translateX(50%)',
}

function ButtonBodyGlyph(props: ButtonBodyGlyphProps) {
  const value = props.value
  const key =
    value === null
      ? 'null'
      : typeof value === 'object'
      ? value.key ?? value.type
      : typeof value === 'number'
      ? 'number'
      : value

  const transitions = useTransition(props, {
    key,
    initial: glyphIn,
    from: glyphFrom,
    enter: glyphIn,
    leave: glyphExit,
  })

  return (
    <div
      css={css`
        position: relative;
        width: 1rem;
        height: 1rem;
        transform-origin: center;
        transform: scale(${props.scale});
      `}>
      {transitions((spring, props) => (
        <animated.div
          css={css`
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;

            display: flex;
            align-items: center;
            justify-content: center;
          `}
          style={spring}>
          {renderGlyph(props)}
        </animated.div>
      ))}
    </div>
  )
}

function renderGlyph({
  color,
  side,
  value,
}: ButtonBodyGlyphProps): React.ReactNode {
  const valueType = typeof value
  const oppositeSide = side === 'Left' ? 'Right' : 'Left'
  switch (valueType === 'string' ? value : valueType) {
    case 'chevron':
      return (
        <Icon
          color={color}
          glyph={side === 'Left' ? ChevronLeft : ChevronRight}
          label={null}
          css={{
            ['margin' + oppositeSide]: '0.25em',
            ['margin' + side]: '-0.25em',
          }}
        />
      )
    case 'caret':
      return <Caret color={color} />
    case 'spinner':
      return <LoadingSpinner color={color} size="1rem" active />
    case 'number':
      return (
        // TODO: respect color configuration
        <ProgressCircle
          color={paletteColors.ink050}
          trackColor="rgba(255, 255, 255, 0.2)"
          trackWidth={1}
          proportion={value as number}
          size={14}
          width={2}
          css={{
            ['margin' + oppositeSide]: '0.25em',
            ['margin' + side]: '-0.25em',
          }}
        />
      )
    case 'function':
      return (
        <Icon
          css={{
            ['margin' + oppositeSide]: '0.5em',
          }}
          color={color}
          inline={false}
          label={null}
          size="1.25rem"
          glyph={value as GlyphComponent}
        />
      )
    default:
      return value
  }
}
