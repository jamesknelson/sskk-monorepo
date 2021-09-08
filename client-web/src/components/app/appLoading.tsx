import { css, keyframes } from '@emotion/css'

import { colors, dimensions } from 'src/theme'

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

export function AppLoading() {
  return (
    <div
      css={css`
        background-color: #f6f8fa;
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;

        left: 0;
        top: ${dimensions.bar};
        bottom: 0;
        right: 0;
      `}>
      <div
        css={css`
          transition: opacity 150ms ease-out;
          animation: ${spinAnimation} 3s infinite linear;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-top: -24px;
          margin-left: -24px;
          height: 48px;
          width: 48px;
          border: 4px solid ${colors.control.icon};
          border-radius: 99px;
          border-left-color: transparent;
        `}
      />
    </div>
  )
}
