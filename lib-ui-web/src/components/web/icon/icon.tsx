import { css } from '@emotion/react'
import React, { AriaRole } from 'react'
import { HighStyleValue, highStyle } from 'retil-css'

import { Theme } from 'src/types'

export type GlyphComponent = React.ComponentType<{
  className?: string
  role?: AriaRole
  title?: string | null
  style?: React.CSSProperties
}>

export type IconProps = Omit<
  React.ComponentProps<'span'>,
  'color' | 'size' | 'title'
> & {
  glyph: GlyphComponent
  inline?: boolean
  label: string | null
  size?: HighStyleValue<number | string, Theme>
  color?: HighStyleValue<string, Theme>
  testID?: string
  transform?: string
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      glyph: Glyph,
      inline = true,
      label = null,
      size = '1em',
      color = 'currentColor',
      testID,
      transform,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        {...props}
        ref={ref}
        css={[
          css`
            display: ${inline ? 'inline-' : ''}block;
            text-align: center;
          `,
          highStyle({
            height: size,
            width: size,
          }),
        ]}>
        <Glyph
          data-testid={testID}
          role="img"
          title={label}
          style={{ transform }}
          css={[
            css`
              display: block;
              margin: 0 auto;
            `,
            highStyle({
              fill: color,
              stroke: color,
              strokeWidth: 0,
              height: size,
              width: size,
            }),
          ]}
        />
      </span>
    )
  },
)
