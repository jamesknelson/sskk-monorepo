import { css } from '@emotion/react'
import { rgba } from 'polished'
import { forwardRef } from 'react'
import {
  inFocusedSurface,
  inHoveredSurface,
  inInvalidSurface,
} from 'retil-interaction'

import {
  controlColors,
  paletteColors,
  structureColors,
  textColors,
} from './colors'
import { easeIn, easeInOut, easeOut } from './easings'
import { standardRadius } from './radii'

export interface FieldBlockProps extends React.ComponentProps<'div'> {
  hint?: React.ReactNode
  input: React.ReactNode
  issue?: React.ReactNode
  message?: React.ReactNode
  label: React.ReactNode
}

const fieldBorderCSS = css`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
`
const fieldInteractionIndicatorCSS = css`
  ${fieldBorderCSS};
  transform-origin: center center;
  transform: scaleX(0);
  transition: transform 125ms ${easeInOut};
`

export const FieldBlock = forwardRef<HTMLDivElement, FieldBlockProps>(
  ({ hint, input, issue, message = issue || hint, label, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      css={css`
        margin: 1.5rem 0;
      `}>
      {/* The label wraps the input, as this will cause the browser to focus
          the input if the user clicks anywhere inside the label. */}
      <label
        css={css`
          color: ${textColors.tertiary};
          cursor: text;
          display: block;
          font-family: sans-serif;
          font-weight: 600;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          width: 100%;
        `}>
        <div
          css={[
            css`
              display: block;
              padding: 0 0.5rem;
              transition: color 200ms ${easeIn}, text-shadow 200ms ${easeIn};
            `,
            inHoveredSurface(css`
              text-shadow: 0 0 2px ${rgba(paletteColors.ink100, 0.4)};
            `),
            inFocusedSurface(css`
              color: ${paletteColors.focusBlue};
              transition: color 200ms ${easeOut}, text-shadow 200ms ${easeOut};
            `),
          ]}>
          <span
            css={css`
              cursor: pointer;
            `}>
            {label}
          </span>
        </div>
        <div
          css={[
            css`
              display: flex;
              justify-content: center;
              padding: 0.25rem 0 calc(0.25rem + 1px);
              position: relative;
            `,
          ]}>
          {input}
          <div
            css={[
              fieldBorderCSS,
              css`
                background-color: ${controlColors.border.default};
              `,
            ]}
          />
          <div
            css={[
              fieldInteractionIndicatorCSS,
              css`
                background-color: ${rgba(paletteColors.ink100, 1)};
                box-shadow: 0 0 3px 0px ${rgba(paletteColors.ink100, 1)};
              `,
              inHoveredSurface(
                css`
                  transform: scaleX(1);
                `,
                inFocusedSurface(css`
                  transform: scaleX(0);
                `),
              ),
            ]}
          />
          <div
            css={[
              fieldInteractionIndicatorCSS,
              css`
                background-color: ${rgba(paletteColors.focusBlue, 0.4)};
                box-shadow: 0 0 3px 0px ${rgba(paletteColors.focusBlue, 0.4)};
              `,
              inFocusedSurface(
                css`
                  transform: scaleX(1);
                `,
              ),
            ]}
          />
        </div>
      </label>
      <div
        css={[
          css`
            background-color: ${structureColors.canvas};
            border-radius: 0 0 ${standardRadius} ${standardRadius};
            padding: 0 0.5rem;
            color: ${textColors.tertiary};
            font-family: sans-serif;
            font-size: 0.75rem;
            line-height: 1.5rem;
          `,
          inInvalidSurface(css`
            background-color: ${controlColors.bg.default};
            color: ${textColors.tertiary};
          `),
        ]}>
        {message}
      </div>
    </div>
  ),
)
