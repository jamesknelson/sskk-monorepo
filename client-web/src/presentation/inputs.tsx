import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { inInvalidSurface } from 'retil-interaction'

import { textColors } from './colors'
import { easeOut } from './easings'

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
