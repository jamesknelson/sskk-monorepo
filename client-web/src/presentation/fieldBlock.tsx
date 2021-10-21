import { css } from '@emotion/react'
import { forwardRef } from 'react'
import { inFocusedSurface, inInvalidSurface } from 'retil-interaction'

import {
  controlColors,
  paletteColors,
  structureColors,
  textColors,
} from './colors'
import { standardRadius } from './radii'

export interface FieldBlockProps extends React.ComponentProps<'div'> {
  hint?: React.ReactNode
  input: React.ReactNode
  issue?: React.ReactNode
  message?: React.ReactNode
  label: React.ReactNode
}

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
          display: block;
          font-family: sans-serif;
          font-weight: 600;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          width: 100%;
        `}>
        <div
          css={css`
            cursor: pointer;
            display: block;
            padding: 0 0.5rem;
          `}>
          {label}
        </div>
        <div
          css={[
            css`
              display: flex;
              justify-content: center;
              padding: 0.25rem 0;
              border-bottom: 1px solid ${controlColors.border.default};
            `,
            inFocusedSurface(css`
              border-bottom-color: ${paletteColors.focusBlue};
            `),
          ]}>
          {input}
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
            background-color: ${controlColors.bg.issue};
            color: ${textColors.issue};
          `),
        ]}>
        {message}
      </div>
    </div>
  ),
)
