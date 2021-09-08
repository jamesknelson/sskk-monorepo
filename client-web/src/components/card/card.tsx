import styled from '@emotion/styled'

import { colors, radii, shadows } from 'src/theme'

export const Card = styled.div`
  background-color: ${colors.structure.bg};
  border-bottom: 1px solid ${colors.structure.border};
  box-shadow: ${shadows.card()};
  border-radius: ${radii.small};

  display: flex;
  flex-direction: column;
  z-index: 2;
`
