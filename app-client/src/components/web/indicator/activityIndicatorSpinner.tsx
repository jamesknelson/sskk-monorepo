import { css, keyframes } from '@emotion/react'
import { HighStyleValue } from 'retil-css'
import { Theme } from 'src/types'

const spinnerDashAnimation = keyframes`
0%,
10% {
  stroke-dashoffset: 280;
  transform: rotate(0);
}

50%,
60% {
  stroke-dashoffset: 75;
  transform: rotate(45deg);
}

100% {
  stroke-dashoffset: 280;
  transform: rotate(360deg);
}
`

const spinnerRotatorAnimation = keyframes`
0% {
  transform: rotateZ(0deg);
}
100% {
  transform: rotateZ(360deg)
}
`

export type ActivityIndicatorSpinnerProps = Omit<
  React.SVGProps<SVGElement>,
  'color' | 'ref'
> & {
  active?: boolean
  color?: HighStyleValue<string, Theme>
  size?: string
}

// From: https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/
export const ActivityIndicatorSpinner = ({
  active = true,
  color = '#aabbcc',
  size = '100%',
  ...rest
}: ActivityIndicatorSpinnerProps) => {
  return (
    (active || null) && (
      <svg
        viewBox="0 0 100 100"
        css={css`
          position: relative;
          background-color: transparent;
          border-radius: 50%;
          display: block;
          width: ${typeof size === 'number' ? size + 'px' : size};
          height: ${typeof size === 'number' ? size + 'px' : size};
          animation: ${spinnerRotatorAnimation} 1.8s linear infinite;
        `}
        {...rest}>
        <circle
          // FIXME: support high style
          stroke={color as string}
          strokeWidth={10}
          strokeMiterlimit={1}
          fill="none"
          cx={50}
          cy={50}
          r={48}
          css={css`
            stroke-dasharray: 283;
            stroke-dashoffset: 280;
            transform-origin: 50% 50%;
            animation: ${spinnerDashAnimation} 1.6s ease-in-out infinite both;
          `}
        />
      </svg>
    )
  )
}
