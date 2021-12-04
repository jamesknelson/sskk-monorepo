import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { rgba } from 'polished'
import React, { forwardRef, useCallback } from 'react'
import { inInvalidSurface } from 'retil-interaction'

import { easeOut } from 'src/style/easings'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (text: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { onChange, ...rest },
  ref,
) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value)
      }
    },
    [onChange],
  )

  return <StyledInput {...(rest as any)} onChange={handleChange} ref={ref} />
})

const StyledInput = styled.input(({ theme }) => {
  const color = theme.color.onSurface
  return [
    css`
      border-radius: 999px;
      color: ${theme.color.onSurface};
      flex-grow: 1;
      font-family: sans-serif;
      font-size: 14px;
      font-weight: 500;
      height: 100%;
      width: 100%;
      padding: 0.25rem 0.5rem;

      ::placeholder {
        color: transparent;
        transition: color 500ms ${easeOut};
      }
    `,
    inInvalidSurface(css`
      ::placeholder {
        color: ${rgba(color, theme.opacity.placeholder)};
      }
    `),
  ]
})
