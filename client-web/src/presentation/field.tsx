import { css } from '@emotion/react'

import { controlColors, structureColors, textColors } from './colors'
import { standardRadius } from './radii'

interface FieldProps extends React.ComponentProps<'div'> {
  children: React.ReactNode
  hint?: React.ReactNode
  message?: React.ReactNode
  label?: React.ReactNode
}

// TODO:
const FieldBlock = (props: FieldProps) => {
  const [{ name }, issues] = useModelInput()
  const firstIssueMessage = issues[0]?.message
  const {
    children,
    hint,
    label = name,
    message = firstIssueMessage || hint,
    ...rest
  } = props

  return (
    <div
      {...rest}
      css={css`
        margin: 1.5rem 0;
      `}>
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
            display: block;
            padding: 0 0.5rem;
          `}>
          {label}
        </div>
        <div
          css={css`
            display: flex;
            justify-content: center;
            padding: 0.25rem 0;
            border-bottom: 1px solid ${controlColors.border.default};
          `}>
          {children}
        </div>
      </label>
      <div
        css={css`
          background-color: ${structureColors.canvas};
          border-radius: 0 0 ${standardRadius} ${standardRadius};
          padding: 0 0.5rem;
          color: ${textColors.tertiary};
          font-family: sans-serif;
          font-size: 0.75rem;
          line-height: 1.5rem;
        `}>
        {message}
      </div>
    </div>
  )
}
