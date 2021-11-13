import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const loadingBarKeyframes = keyframes`
  0% {
    transform: scaleX(0);
  }
  10% {
    transform: scaleX(0.3);
  }
  50% {
    transform: scaleX(0.7);
  }
  90% {
    transform: scaleX(0.8);
  }
  100% {
    transform: scaleX(1);
  }
`

export interface LoadingBarProps {
  active: boolean
  color?: string
}

export const LoadingBar = styled.div<LoadingBarProps>`
  height: 2px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.primaryWash};
  background-size: 35px 35px;
  z-index: 9999;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) inset;
  transition: transform ease-in 300ms, opacity ease-in 300ms;
  transition-delay: 0;
  transform-origin: left center;
  transform: scaleX(0);
  opacity: 0;
  bottom: 0;

  ${(props) =>
    props.active &&
    css`
      opacity: 1;

      /**
       * Wait 100ms before showing any loading bar. This should be long enough
       * prevent the display of a loading bar for instant page loads, while
       * short enough to help the user know that something is happening on
       * pages with async data.
       */
      transition-delay: 100ms;

      animation: ${loadingBarKeyframes} 10s ease-out;
      animation-fill-mode: forwards;
    `}
`
