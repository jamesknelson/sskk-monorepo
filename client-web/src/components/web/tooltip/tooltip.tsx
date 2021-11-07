import { useCallback, useRef } from 'react'
import { media, useMediaSelector } from 'retil-media'
import { Placement } from '@popperjs/core'
import Tippy, { TippyProps } from '@tippyjs/react/headless'

import { TransitionHandle } from 'src/utils/transitionHandle'

import { TooltipBody } from './tooltipBody'

export type { Placement }

export interface TooltipProps
  extends Omit<TippyProps, 'animation' | 'render' | 'touch'> {
  children: React.ReactElement
  label: React.ReactElement | string
  offset?: [number, number]
  placement?: Placement
}

export function Tooltip({
  children,
  label,
  offset,
  placement = 'top',
  ...rest
}: TooltipProps) {
  const transitionHandleRef = useRef<TransitionHandle>(null)
  const onMount = useCallback(() => {
    transitionHandleRef.current?.show()
  }, [])
  const onHide = useCallback(({ unmount }) => {
    transitionHandleRef.current?.hide().finally(unmount)
  }, [])

  let isPhoneOrSSR = useMediaSelector(media.small) ?? true
  if (isPhoneOrSSR) {
    return children
  } else {
    return (
      <Tippy
        {...rest}
        animation
        placement={placement}
        offset={offset}
        touch={false}
        render={(attrs) => (
          <TooltipBody
            placement={attrs['data-placement']}
            referenceHidden={attrs['data-reference-hidden'] === 'true'}
            transitionHandleRef={transitionHandleRef}>
            {label}
          </TooltipBody>
        )}
        onMount={onMount}
        onHide={onHide}
        {...rest}>
        {children}
      </Tippy>
    )
  }
}
