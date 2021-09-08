import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

import { Card } from 'src/components/card'
import { colors, dimensions } from 'src/theme'

export const Title = styled.h1`
  color: ${colors.text.default};
  font-size: 2rem;
  font-weight: 400;
  margin-top: 4rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

export const AuthLayout = ({ children, title, ...rest }: any) => {
  return (
    <div
      {...rest}
      css={css`
        padding: 0 1rem;
        margin-top: 2rem;
      `}>
      <div
        css={css`
          margin: 0 auto 2rem;
          max-width: ${dimensions.smallCardWidth};
        `}>
        <Card
          css={css`
            padding: 0rem 2rem 3rem;
          `}>
          {title && <Title>{title}</Title>}
          {children}
        </Card>
      </div>
    </div>
  )
}
