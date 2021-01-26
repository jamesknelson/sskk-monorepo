import React from 'react'
import { Placement } from 'popper.js'
import Tippy, { TippyProps } from '@tippy.js/react'

import { mediaQueries } from 'src/theme'
import { useMediaQuery } from 'src/utils/media'

export interface TooltipProps extends Omit<TippyProps, 'content'> {
  content?: TippyProps['content']
}

export type TooltipPlacement = Placement

export function Tooltip({
  children,
  placement = 'top',
  content,
  enabled,
  ...rest
}: TooltipProps) {
  let isPhone = useMediaQuery(mediaQueries.phoneOnly)
  if (isPhone) {
    return children
  } else {
    return (
      <Tippy
        placement={placement}
        touch={false}
        arrow={true}
        // arrowType="round"
        content={content || <></>}
        enabled={enabled === undefined ? !!content : enabled}
        {...rest}>
        {children}
      </Tippy>
    )
  }
}
