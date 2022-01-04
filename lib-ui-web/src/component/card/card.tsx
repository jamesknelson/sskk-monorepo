import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cardShadow } from '~/style/shadows'

export interface CardProps {
  radius?: string | 0
}

export const Card = styled.div<CardProps>(
  ({ radius = 0, theme }) => css`
    display: flex;
    flex-direction: column;
    position: relative;

    background-color: ${theme.color.surface};
    box-shadow: ${cardShadow({ color: theme.color.primary })};
    border: 1px solid ${theme.color.surfaceBorder};
    border-radius: ${radius};
  `,
)
