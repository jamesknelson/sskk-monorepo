import { css } from '@emotion/react'
import { rgba } from 'polished'
import { forwardRef } from 'react'
import { highStyle } from 'retil-css'
import { inActiveSurface, inDisabledSurface } from 'retil-interaction'
import { useTheme } from 'src/style/useTheme'

import {
  LabelledButtonBody,
  LabelledButtonBodyContentConfig,
} from './labelledButtonBody'

type ButtonBodyProps = Omit<JSX.IntrinsicElements['div'], 'children' | 'ref'> &
  Omit<LabelledButtonBodyContentConfig, 'labelColor'> & {
    labelColor?: string
  }

export const OutlinedLabelledButtonBody = forwardRef<
  HTMLDivElement,
  ButtonBodyProps
>((props, ref) => {
  const theme = useTheme()

  const {
    color = theme.color.primary,
    labelColor = theme.color.primary,
    ...rest
  } = props

  return (
    <LabelledButtonBody
      {...rest}
      ref={ref}
      glyphColor={color}
      themeCSS={[
        // TODO: accept high style, mapping those styles to shadows
        // TODO: this should only be applied when *not* disabled
        css`
          box-shadow: 0 0 0 1px ${color} inset, 0 0 10px ${rgba(color, 0.12)},
            0 0 10px ${rgba(color, 0.12)} inset;
          text-shadow: 0 0 5px ${rgba(color, 0.1)};
        `,
        highStyle({
          color: labelColor,
        }),
        inActiveSurface(css`
          box-shadow: 0 0 0 1px ${color} inset, 0 0 15px ${rgba(color, 0.2)},
            0 0 15px ${rgba(color, 0.2)} inset;
          text-shadow: 0 0 8px ${rgba(color, 0.15)};
        `),
        inDisabledSurface(
          // TODO: handle progress circles as well
          !rest.busyIndicator &&
            css`
              box-shadow: 0 0 0 1px ${color} inset;
              opacity: 0.5;
            `,
        ),
      ]}
    />
  )
})
