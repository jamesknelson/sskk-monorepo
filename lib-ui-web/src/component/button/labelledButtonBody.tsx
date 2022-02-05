import { css, Theme } from '@emotion/react'
import type { Interpolation } from '@emotion/serialize'
import React, { forwardRef } from 'react'
import { isValidElementType } from 'react-is'
import { animated, useTransition } from 'react-spring'
import { HighStyleValue } from 'retil-css'
import { inDisabledSurface } from 'retil-interaction'

import { Caret } from '~/component/caret'
import { GlyphComponent, Icon } from '~/component/icon'
import { ActivityIndicatorSpinner } from '~/component/indicator/activityIndicatorSpinner'
import { FocusHoverIndicatorRing } from '~/component/indicator/focusHoverIndicatorRing'
import { ProgressIndicatorCircle } from '~/component/indicator/progressIndicatorCircle'
import { easeInOut, easeOut } from '~/style/easings'
import { ChevronLeft, ChevronRight } from '~/style/glyphs'

// - A function will be rendered as an icon
// - An element will be rendered as-is
// - A number will be rendered as a progress circle
// - `null` will be rendered as extra space
// - `undefined` will cause nothing to be rendered
export type LabelledButtonBodyGlyphProp =
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
export interface LabelledButtonBodyContentConfig {
  // Supplying `true` to `busyIndicator` will replace the rest of the content
  // with a busy indicator, while 'above' and 'below' can be used to animate
  // the indiator in and out.
  busyIndicator?: 'above' | 'below' | true
  busyIndicatorColor?: HighStyleValue<string>
  glyphColor?: HighStyleValue<string>
  inline?: boolean
  label: React.ReactElement | string
  leftGlyph?: LabelledButtonBodyGlyphProp
  leftGlyphScale?: number
  leftGlyphColor?: HighStyleValue<string>
  lowProfile?: boolean
  rightGlyph?: LabelledButtonBodyGlyphProp
  rightGlyphColor?: HighStyleValue<string>
  rightGlyphScale?: number
  themeCSS?: Interpolation<Theme>
}

export type LabelledButtonBodyContentProps = LabelledButtonBodyContentConfig &
  JSX.IntrinsicElements['div']

export const LabelledButtonBody = forwardRef<
  HTMLDivElement,
  LabelledButtonBodyContentProps
>((props, ref) => {
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
    <FocusHoverIndicatorRing
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

            user-select: none;

            transition: background-color 150ms ${easeOut},
              opacity 150ms ${easeOut}, text-shadow 150ms ${easeOut},
              box-shadow 150ms ${easeOut}, color 150ms ${easeOut};
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
              <ActivityIndicatorSpinner
                color={busyIndicatorColor}
                size="1rem"
                active
              />
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
              css={[
                css`
                  flex-grow: 1;
                  padding: 0.0625em ${rightGlyph ? 0 : 0.33}em 0
                    ${leftGlyph ? 0 : 0.33}em;

                  display: flex;
                  align-items: center;
                  justify-content: center;

                  transition: transform 150ms ${easeOut};
                `,
                leftGlyph === null &&
                  rightGlyph !== null &&
                  css`
                    transform: translateX(-0.75rem);
                  `,
                rightGlyph === null &&
                  leftGlyph !== null &&
                  css`
                    transform: translateX(0.75rem);
                  `,
              ]}>
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
    </FocusHoverIndicatorRing>
  )
})

interface ButtonBodyGlyphProps {
  color: HighStyleValue<string>
  scale?: number
  side: 'Left' | 'Right'
  value: LabelledButtonBodyGlyphProp
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

type GlyphType =
  | Extract<LabelledButtonBodyGlyphProp, string>
  | 'component'
  | 'object'
  | 'number'

function ButtonBodyGlyph(props: ButtonBodyGlyphProps) {
  const value = props.value
  const valueType = typeof value
  const type = (
    valueType === 'string'
      ? value
      : isValidElementType(value)
      ? 'component'
      : typeof value
  ) as GlyphType
  const key =
    value === null
      ? 'null'
      : typeof value === 'object'
      ? value.key ?? value.type ?? value
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
        width: 1.5rem;
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
          {renderGlyph(type, props)}
        </animated.div>
      ))}
    </div>
  )
}

function renderGlyph(
  type: GlyphType,
  { color, side, value }: ButtonBodyGlyphProps,
): React.ReactNode {
  const oppositeSide = side === 'Left' ? 'Right' : 'Left'
  switch (type) {
    case 'chevron':
      return (
        <Icon
          color={color}
          glyph={side === 'Left' ? ChevronLeft : ChevronRight}
          label={null}
          css={{
            ['margin' + oppositeSide]: '0.33em',
            ['margin' + side]: '-0.33em',
          }}
        />
      )
    case 'caret':
      return (
        <Caret
          color={color}
          rotationDegrees={90}
          css={{
            ['margin' + oppositeSide]: '0.5em',
            ['margin' + side]: '-0.5em',
          }}
        />
      )
    case 'spinner':
      return (
        <ActivityIndicatorSpinner
          color={color}
          size="1rem"
          active
          css={{
            marginTop: -1,
            ['margin' + oppositeSide]: '0.25em',
            ['margin' + side]: '-0.25em',
          }}
        />
      )
    case 'number':
      return (
        // TODO: respect color configuration - it's currently not supported as
        // the component doesn't accept HighStyle right now
        <ProgressIndicatorCircle
          colorString="{rgba(255, 255, 255, 0.8)"
          trackColorString="rgba(255, 255, 255, 0.2)"
          trackWidth={1}
          proportion={value as number}
          size={14}
          width={2}
          css={{
            ['margin' + oppositeSide]: '0.125em',
            ['margin' + side]: '-0.125em',
          }}
        />
      )
    case 'component':
      return (
        <Icon
          css={{
            ['margin' + oppositeSide]: '0.125em',
            ['margin' + side]: '-0.125em',
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
