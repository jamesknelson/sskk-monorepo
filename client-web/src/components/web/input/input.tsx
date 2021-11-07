import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import { useCallback } from 'react'
import { inInvalidSurface } from 'retil-interaction'

import { textColors } from './colors'
import { easeOut } from './easings'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (text: string) => void
}

export function Input(props: InputProps) {
  const { onChange, ...rest } = props

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value)
      }
    },
    [onChange],
  )

  return <input {...(rest as any)} onChange={handleChange} />
}

export type InputProps = JSX.IntrinsicElements['input']

export const Input = styled.input(
  css`
    border-radius: 999px;
    color: ${textColors.default};
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
      color: ${textColors.placeholder};
    }
  `),
)
