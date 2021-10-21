import styled from '@emotion/styled'

import { structureColors } from './colors'
import { cardShadow } from './shadows'

export interface CardProps {
  radius?: string | 0
}

export const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  position: relative;

  background-color: ${structureColors.bg};
  box-shadow: ${cardShadow()};
  border: 1px solid ${structureColors.border};
  border-radius: ${(props) => props.radius ?? 0};
`
