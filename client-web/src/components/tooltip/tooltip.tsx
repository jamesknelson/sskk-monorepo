import React from 'react'
import { Placement } from 'popper.js'
import { useMediaSelector } from 'retil-media'
import Tippy, { TippyProps } from '@tippy.js/react'

import { mediaSelectors } from 'src/theme'

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
  let isPhone = useMediaSelector(mediaSelectors.phoneOnly)
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
