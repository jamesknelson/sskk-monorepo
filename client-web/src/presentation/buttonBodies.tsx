import { css } from '@emotion/react'
import { Interpolation } from '@emotion/serialize'
import { rgba } from 'polished'
import type React from 'react'
import { forwardRef } from 'react'
// import {
//   animated,
//   useSpring,
//   useTransition,
//   to as interpolate,
// } from 'react-spring'
import { highStyle } from 'retil-css'
import {
  inActiveSurface,
  inDisabledSurface,
  inWorkingSurface,
} from 'retil-interaction'

import { ChevronRight } from 'src/assets/glyphs'

// import { Caret } from './caret'
import { controlColors, paletteColors } from './colors'
import { easeInOut, easeOut } from './easings'
import { GlyphComponent, Icon } from './icon'
import { InteractionRingDiv } from './interactionRing'
import { LoadingSpinner } from './loadingSpinner'

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
      labelColor={labelColor}
      themeCSS={[
        // TODO: this should only be applied when *not* disabled
        css`
          box-shadow: 0 0 0 1px ${color} inset, 0 0 10px ${rgba(color, 0.12)},
            0 0 10px ${rgba(color, 0.12)} inset;
          text-shadow: 0 0 5px ${rgba(color, 0.1)};
        `,
        inActiveSurface(css`
          box-shadow: 0 0 0 1px ${color} inset, 0 0 15px ${rgba(color, 0.2)},
            0 0 15px ${rgba(color, 0.2)} inset;
          text-shadow: 0 0 8px ${rgba(color, 0.15)};
        `),
        inDisabledSurface(css`
          box-shadow: 0 0 0 1px ${color} inset;
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
    <ButtonBody
      {...rest}
      ref={ref}
      labelColor={labelColor}
      themeCSS={[
        highStyle({
          backgroundColor: color,
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

export interface ButtonBodyContentConfig {
  // When left/right, it will override any glyph in that position
  busyIndicatorPlacement?: 'above' | 'below' | 'left' | 'right'
  caret?: boolean
  caretColor?: string
  caretRotationDegrees?: number
  chevron?: 'left' | 'right' | null
  chevronColor?: string
  glyph?: GlyphComponent | null
  glyphColor?: string
  glyphPlacement?: 'left' | 'right'
  label: React.ReactElement | string
  labelWhenComplete?: React.ReactElement | string
  labelColor: string
  lowProfile?: boolean
  showBusyIndicator?: boolean
  showBusyIndicatorColor?: string
  themeCSS?: Interpolation<any>
}

export type ButtonBodyContentProps = ButtonBodyContentConfig &
  JSX.IntrinsicElements['div']

export const ButtonBody = forwardRef<HTMLDivElement, ButtonBodyContentProps>(
  (props, ref) => {
    const defaultSymbolColor = props.glyphColor || rgba(props.labelColor, 0.85)

    const {
      // caret = false,
      // caretColor,
      busyIndicatorPlacement = 'below',
      chevron = null,
      chevronColor = defaultSymbolColor,
      glyph,
      glyphColor = defaultSymbolColor,
      // glyphSide = 'left',
      label,
      labelColor,
      labelWhenComplete,
      lowProfile = false,
      showBusyIndicator,
      showBusyIndicatorColor = defaultSymbolColor,
      themeCSS,
      ...rest
    } = props

    return (
      <InteractionRingDiv
        css={[
          css`
            cursor: pointer;
          `,
          inWorkingSurface(css`
            cursor: progress;
          `),
          inDisabledSurface(
            css`
              cursor: default;
            `,
            inWorkingSurface(css`
              cursor: wait;
            `),
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
            inDisabledSurface(
              !showBusyIndicator &&
                css`
                  opacity: 0.5;
                `,
              inWorkingSurface(css`
                opacity: 1;
              `),
            ),
            highStyle({
              color: labelColor,
            }),
          ]}>
          <div
            css={[
              css`
                flex-grow: 1;

                display: flex;
                align-items: center;
                flex-direction: column;

                transform: translateY(
                  ${showBusyIndicator
                    ? '-100%'
                    : busyIndicatorPlacement === 'below'
                    ? 0
                    : '-200%'}
                );
                transition: transform 250ms ${easeInOut};
              `,
              inWorkingSurface(css`
                transform: translateY(-100%);
              `),
            ]}>
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
              <LoadingSpinner
                color={showBusyIndicatorColor}
                size="1rem"
                active
              />
            </div>
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
                    ${busyIndicatorPlacement === 'below' ? 0 : '200%'}
                  );
                `,
              ]}>
              {glyph && (
                <Icon
                  css={css`
                    margin-right: 0.5rem;
                  `}
                  color={glyphColor}
                  inline={false}
                  label={null}
                  size="1.25rem"
                  glyph={glyph as GlyphComponent}
                />
              )}
              <div
                css={css`
                  flex-grow: 1;

                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}>
                <span>{label}</span>
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
              </div>
            </div>
          </div>
        </div>
      </InteractionRingDiv>
    )
  },
)

// const AnimatedButtonGlyphWrapper: React.FunctionComponent<
//   React.ComponentProps<typeof animated.div>
// > = (props) => (
//   <animated.div
//     css={css`
//       position: absolute;
//       left: 0;
//     `}
//     {...props}
//   />
// )

// const AnimatedButtonLabelWrapper: React.FunctionComponent<
//   React.ComponentProps<typeof animated.span>
// > = (props) => (
//   <animated.span
//     css={css`
//       flex-grow: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     `}
//     {...props}
//   />
// )
