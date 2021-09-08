import { css, keyframes } from '@emotion/react'

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

// From: https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/
export const LoadingSpinner = ({
  active = true,
  color = '#aabbcc',
  borderWidth = 2.5,
  position = 'relative',
  size = '100%',
  ...rest
}) => {
  return (
    (active || null) && (
      <svg
        viewBox="0 0 100 100"
        css={css`
          position: ${position};
          background-color: transparent;
          border-radius: 50%;
          display: block;
          width: ${typeof size === 'number' ? size + 'px' : size};
          height: ${typeof size === 'number' ? size + 'px' : size};
          animation: ${spinnerRotatorAnimation} 1.8s linear infinite;
        `}
        {...rest}>
        <circle
          stroke={color}
          strokeWidth={4}
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
