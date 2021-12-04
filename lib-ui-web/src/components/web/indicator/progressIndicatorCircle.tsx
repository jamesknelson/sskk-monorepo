import { css } from '@emotion/react'
import { animated, useSpring } from 'react-spring'

import { useTheme } from 'src/style/useTheme'

export type ProgressIndicatorCircleProps = Omit<
  React.SVGProps<SVGElement>,
  'ref'
> & {
  active?: boolean

  // TODO: accept HighStyle strings
  colorString?: string
  trackColorString?: string

  proportion: number // 0 <= proportion <= 1
  size: number
  trackWidth?: number
  width?: number
}

export const ProgressIndicatorCircle = (
  props: ProgressIndicatorCircleProps,
) => {
  const theme = useTheme()
  const {
    active = true,
    colorString: color = theme.color.primary,
    width = 3,
    proportion,
    size,
    trackColorString: trackColor = theme.color.altSurface,
    trackWidth = 1,
    ...rest
  } = props
  const spring = useSpring({
    proportion,
  })

  const px = 100 / size
  const outerRadius = 50
  const innerRadius = outerRadius - width * px

  const trackOuterRadius = outerRadius - ((width - trackWidth) / 2) * px
  const trackInnerRadius = innerRadius + ((width - trackWidth) / 2) * px

  return (
    (active || null) && (
      <svg
        viewBox="0 0 100 100"
        css={css`
          position: relative;
          background-color: transparent;
          display: block;
          width: ${size}px;
          height: ${size}px;
        `}
        {...rest}>
        <path
          d={segmentPath(
            50,
            50,
            trackInnerRadius,
            trackOuterRadius,
            0,
            359.999,
          )}
          fill={trackColor}
          stroke="none"
        />
        <animated.path
          d={spring.proportion.to((proportion) =>
            segmentPath(
              50,
              50,
              innerRadius,
              outerRadius,
              -90,
              proportion * 360 - 90,
            ),
          )}
          fill={color}
          stroke="none"
        />
      </svg>
    )
  )
}

// https://observablehq.com/@haakenlid/svg-circle
const polarToCartesian = (x: number, y: number, r: number, degrees: number) => {
  const radians = (degrees * Math.PI) / 180.0
  return [x + r * Math.cos(radians), y + r * Math.sin(radians)]
}
const segmentPath = (
  x: number,
  y: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
) => {
  // https://svgwg.org/specs/paths/#PathDataEllipticalArcCommands
  if (a1 - a0 >= 360) {
    a1 = a0 + 360 * 0.9999
  }
  const arc = Math.abs(a0 - a1) > 180 ? 1 : 0
  const point = (radius: number, degree: number) =>
    polarToCartesian(x, y, radius, degree)
      .map((n) => n.toPrecision(5))
      .join(',')
  return [
    `M${point(r0, a0)}`,
    `A${r0},${r0},0,${arc},1,${point(r0, a1)}`,
    `L${point(r1, a1)}`,
    `A${r1},${r1},0,${arc},0,${point(r1, a0)}`,
    'Z',
  ].join('')
}
