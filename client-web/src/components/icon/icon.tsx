import { css } from '@emotion/react'
import React from 'react'
import { HighStyleValue, highStyle } from 'retil-css'

const DEFAULT_ICON_SIZE = '24px'

export type IconProps = Omit<React.ComponentProps<'span'>, 'color' | 'size'> & {
  display?: React.CSSProperties['display']
  glyph: React.ComponentType<any>
  label?: string | null
  size?: HighStyleValue<number | string>
  color?: HighStyleValue<string>
  testID?: string
  transform?: string
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      display = 'inline-block' as const,
      glyph: Glyph,
      label = null,
      size = DEFAULT_ICON_SIZE,
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
            display: ${display};
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
          title={label || undefined}
          style={{ transform }}
          aria-label={label || undefined}
          css={[
            css`
              display: block;
              margin: 0 auto;
            `,
            highStyle({
              fill: color,
              height: size,
              width: size,
            }),
          ]}
        />
      </span>
    )
  },
)
