import { css } from '@emotion/react'
import { rgba } from 'polished'

import { paletteColors } from './colors'

// FIXME: there's a vite bug where putting this directly into the defaults via
// destructuring causes it to be undefined during server rendering in some
// cases, which in turn causes some pages to briefly show the loading page
// on the client after initial load. For some reason.
const defaultColor = paletteColors.ink900

export type ProgressPieProps = Omit<React.SVGProps<SVGElement>, 'ref'> & {
  active?: boolean
  color?: string
  borderWidth?: number
  proportion: number // 0 <= proportion <= 1
  size?: string
}

export const ProgressPie = ({
  active = true,
  color = defaultColor,
  borderWidth = 1,
  proportion,
  size = '100%',
  ...rest
}: ProgressPieProps) => {
  return (
    (active || null) && (
      <svg
        viewBox="0 0 100 100"
        css={css`
          position: relative;
          background-color: transparent;
          border-radius: 50%;
          box-shadow: 0 0 0 1px ${color} inset, 0 0 10px ${rgba(color, 0.12)},
            0 0 10px ${rgba(color, 0.12)} inset;
          display: block;
          width: ${typeof size === 'number' ? size + 'px' : size};
          height: ${typeof size === 'number' ? size + 'px' : size};

          path {
            transition: 0.2s;
          }
        `}
        {...rest}>
        <path
          d={createSvgArc(50, 50, 44, 0, proportion * Math.PI * 2)}
          fill={color}
          stroke="none"
        />
      </svg>
    )
  )
}

// From: https://codepen.io/smlsvnssn/pen/FolaA
function createSvgArc(
  x: number,
  y: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  if (startAngle > endAngle) {
    var s = startAngle
    startAngle = endAngle
    endAngle = s
  }
  if (endAngle - startAngle >= Math.PI * 2) {
    endAngle = Math.PI * 1.99999
  }

  var largeArc = endAngle - startAngle <= Math.PI ? 0 : 1

  return [
    'M',
    x,
    y,
    'L',
    x + Math.sin(startAngle) * r,
    y - Math.cos(startAngle) * r,
    'A',
    r,
    r,
    0,
    largeArc,
    1,
    x + Math.sin(endAngle) * r,
    y - Math.cos(endAngle) * r,
    'L',
    x,
    y,
  ].join(' ')
}
