import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cardShadow } from 'src/style/shadows'

export interface CardProps {
  radius?: string | 0
}

export const Card = styled.div<CardProps>(
  ({ radius = 0, theme }) => css`
    display: flex;
    flex-direction: column;
    position: relative;

    background-color: ${theme.color.bg};
    box-shadow: ${cardShadow()};
    border: 1px solid ${theme.color.border};
    border-radius: ${radius};
  `,
)
