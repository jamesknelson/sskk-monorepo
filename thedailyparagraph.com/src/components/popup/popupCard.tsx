import React from 'react'
import { css } from 'styled-components'

const shadows = {
  default:
    '0 0 15px 100vh rgba(0, 0, 0, 0.02), 0 0 15px 3px rgba(0, 0, 0, 0.03) inset',
  raised: '0 0 10px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05)',
}

export interface PopupCardProps extends React.ComponentProps<'div'> {
  radius?: string
  raised?: boolean
  rounded?: boolean
}

export const PopupCard = React.forwardRef<HTMLDivElement, PopupCardProps>(
  ({ radius, raised, rounded, ...rest }, ref) => (
    <div
      ref={ref}
      css={css`
        background-color: white;
        border: 1px solid #f0f0f0;
        box-shadow: ${shadows[raised ? 'raised' : 'default']};
        border-radius: ${radius || (rounded ? 10 : 0) + 'px'};
        position: relative;
      `}
      {...rest}
    />
  ),
)
