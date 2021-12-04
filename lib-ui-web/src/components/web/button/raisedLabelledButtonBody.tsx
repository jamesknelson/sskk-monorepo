import { css } from '@emotion/react'
import { rgba, tint } from 'polished'
import { forwardRef } from 'react'
import { highStyle } from 'retil-css'
import { inActiveSurface, inDisabledSurface } from 'retil-interaction'
import { useTheme } from 'src/style/useTheme'

import {
  LabelledButtonBodyContentConfig,
  LabelledButtonBody,
} from './labelledButtonBody'

type ButtonBodyProps = Omit<JSX.IntrinsicElements['div'], 'children' | 'ref'> &
  Omit<LabelledButtonBodyContentConfig, 'labelColor'> & {
    labelColor?: string
  }

export const RaisedLabelledButtonBody = forwardRef<
  HTMLDivElement,
  ButtonBodyProps
>((props, ref) => {
  const theme = useTheme()

  const {
    color = theme.color.primary,
    labelColor = 'rgba(255, 255, 255, 0.9)',
    ...rest
  } = props

  return (
    <LabelledButtonBody
      {...rest}
      ref={ref}
      glyphColor={rgba(labelColor, 0.85)}
      themeCSS={[
        highStyle({
          backgroundColor: {
            default: color,
            [inDisabledSurface]: tint(0.5, color),
          },
          color: labelColor,
        }),
        css`
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2),
            1px 1px 1px rgba(255, 255, 255, 0.12) inset,
            -1px -1px 1px rgba(0, 0, 0, 0.08) inset;
        `,
        inActiveSurface(css`
          box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.08),
            -1px -1px 1px rgba(255, 255, 255, 0.2) inset,
            1px 1px 1px rgba(0, 0, 0, 0.1) inset;
        `),
      ]}
    />
  )
})
