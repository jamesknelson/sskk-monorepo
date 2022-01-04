import { rgba } from 'polished'
import { forwardRef } from 'react'
import { HighStyleValue, highStyle, mapHighStyleValue } from 'retil-css'
import { inActiveSurface, inDisabledSurface } from 'retil-interaction'

import { useTheme } from '~/theme/useTheme'

import {
  LabelledButtonBody,
  LabelledButtonBodyContentConfig,
} from './labelledButtonBody'

type ButtonBodyProps = Omit<
  JSX.IntrinsicElements['div'],
  'children' | 'color' | 'ref'
> &
  Omit<LabelledButtonBodyContentConfig, 'labelColor'> & {
    color?: HighStyleValue<string>
    labelColor?: HighStyleValue<string>
  }

export const OutlinedLabelledButtonBody = forwardRef<
  HTMLDivElement,
  ButtonBodyProps
>((props, ref) => {
  const theme = useTheme()

  const { color = theme.color.primary, labelColor = color, ...rest } = props

  return (
    <LabelledButtonBody
      {...rest}
      ref={ref}
      glyphColor={color}
      themeCSS={[
        // TODO: this should only be applied when *not* disabled
        highStyle({
          boxShadow: mapHighStyleValue(
            color,
            (color) => `0 0 0 1px ${color} inset, 0 0 10px ${rgba(color, 0.12)},
          0 0 10px ${rgba(color, 0.12)} inset`,
          ),
          color: labelColor,
          textShadow: mapHighStyleValue(
            color,
            (color) => `0 0 5px ${rgba(color, 0.1)}`,
          ),
        }),
        inActiveSurface(
          highStyle({
            boxShadow: mapHighStyleValue(
              color,
              (color) => `0 0 0 1px ${color} inset, 0 0 15px ${rgba(
                color,
                0.2,
              )},
            0 0 15px ${rgba(color, 0.2)} inset`,
            ),
            textShadow: mapHighStyleValue(
              color,
              (color) => `0 0 8px ${rgba(color, 0.15)}`,
            ),
          }),
        ),
        inDisabledSurface(
          // TODO: handle progress circles as well
          !rest.busyIndicator &&
            highStyle({
              opacity: 0.5,
              boxShadow: mapHighStyleValue(
                color,
                (color) => `0 0 0 1px ${color} inset`,
              ),
            }),
        ),
      ]}
    />
  )
})
