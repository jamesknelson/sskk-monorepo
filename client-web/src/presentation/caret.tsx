import { css } from '@emotion/react'
import { forwardRef } from 'react'
import {
  Transition,
  HighStyleValue,
  highStyle,
  stringifyTransition,
} from 'retil-css'

import { paletteColors } from 'src/presentation/colors'
import { appendPixelUnitsIfRequired } from 'src/utils/appendPixelUnitsIfRequired'

export interface CaretProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: HighStyleValue<string>
  rotationDegrees?: number
  size?: number | string
  transition?: Transition
}

export const defaultColor = paletteColors.ink500
export const defaultSize = 3
export const defaultRotationDegrees = 0

export const Caret = forwardRef<HTMLDivElement, CaretProps>(function Caret(
  {
    color = defaultColor,
    rotationDegrees = defaultRotationDegrees,
    size = defaultSize,
    transition,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      css={[
        css`
          width: 0;
          height: 0;
          border: 3px solid transparent;
          border-color: transparent;
          border-style: solid;
        `,
        {
          transition:
            stringifyTransition(transition, {
              properties: {
                fillColor: 'border-left-color',
                size: ['border-width', 'margin-right'],
                rotationDegrees: ['transform'],
              },
            }) || undefined,
        },
        highStyle({
          borderLeftColor: color,
          borderWidth: size,
          marginRight: `calc(0 - ${appendPixelUnitsIfRequired(size)}`,
          transform: `rotate(${rotationDegrees}deg)`,
        }),
      ]}
      {...rest}
    />
  )
})
