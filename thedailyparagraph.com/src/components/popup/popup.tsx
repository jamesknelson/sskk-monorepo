import React, { useCallback, useContext } from 'react'
import { createPortal } from 'react-dom'
import {
  Manager,
  ManagerProps,
  Reference,
  Popper,
  PopperProps,
  PopperChildrenProps,
} from 'react-popper'
import { useTransition } from 'react-spring'

import { PopupTriggerSnapshot, usePopupTrigger } from 'retil-popup-trigger'

import { PopupArrow, PopupBox } from './popupStyles'

const modifiers = {
  flip: { enabled: false },
  preventOverflow: { enabled: false },
  hide: { enabled: false },
}

export const PopupContext = React.createContext({
  open: false,
  trigger: (undefined as any) as PopupTriggerSnapshot,
})

export function useClosePopup() {
  let { trigger } = useContext(PopupContext)
  return trigger.close
}

export interface PopupTriggerProps {
  children: (ref: any) => React.ReactNode
}

export function PopupTrigger({ children }: PopupTriggerProps) {
  return (
    <Reference>
      {({ ref }) => <InnerPopperTrigger popperRef={ref} children={children} />}
    </Reference>
  )
}

function InnerPopperTrigger({ children, popperRef }: any) {
  let { trigger } = useContext(PopupContext)
  let triggerRef = trigger && trigger.ref
  let ref = useCallback(
    (node) => {
      popperRef(node)
      if (triggerRef) {
        triggerRef(node)
      }
    },
    [popperRef, triggerRef],
  )

  return children(ref)
}

interface UnstyledPopupProps extends Omit<PopperProps, 'children'> {
  children: (props: PopperChildrenProps) => React.ReactNode
}

function UnstyledPopup({ children, ...popperProps }: UnstyledPopupProps) {
  return (
    <Popper {...popperProps}>
      {({ ref, ...renderProps }) => (
        <InnerUnstyledPopup
          children={children}
          renderProps={renderProps}
          popperRef={ref}
        />
      )}
    </Popper>
  )
}

function InnerUnstyledPopup({ popperRef, children, renderProps }: any) {
  let { trigger } = useContext(PopupContext)
  let containerRef = trigger && trigger.popupRef
  let ref = useCallback(
    (node) => {
      popperRef(node)
      if (containerRef) {
        containerRef(node)
      }
    },
    [popperRef, containerRef],
  )
  return children({
    ...renderProps,
    ref,
  })
}

export interface PopupProviderProps extends ManagerProps {
  triggerOnFocus?: boolean
  triggerOnHover?: boolean
  triggerOnSelect?: boolean
  closeOnEscape?: boolean
  delayIn?: number
  delayOut?: number

  open?: boolean

  children: React.ReactNode
}

export const PopupProvider = ({
  triggerOnFocus,
  triggerOnHover,
  triggerOnSelect,
  closeOnEscape,
  delayIn,
  delayOut,

  open,

  children,

  ...popperProps
}: PopupProviderProps) => {
  let trigger = usePopupTrigger({
    triggerOnFocus,
    triggerOnHover,
    triggerOnSelect,
    closeOnEscape,
    delayIn,
    delayOut,
  })

  if (open === undefined) {
    open = !!trigger.active
  }

  return (
    <PopupContext.Provider value={{ open, trigger }}>
      <Manager {...popperProps}>{children}</Manager>
    </PopupContext.Provider>
  )
}

interface PopupProps extends Omit<UnstyledPopupProps, 'children'> {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
}

export function Popup({ children, className, style, id, ...rest }: PopupProps) {
  let { open } = useContext(PopupContext)
  let transition = useTransition(open, {
    config: { tension: 415 },
    from: { opacity: 0, scale: 0.5, top: -10 },
    enter: { opacity: 1, scale: 1, top: 0 },
    leave: { opacity: 0, scale: 0.5, top: -10 },
  })

  return transition(
    (transitionProps, item, { key }) =>
      item && (
        <UnstyledPopup
          {...rest}
          key={key}
          modifiers={
            {
              ...modifiers,
              // We disable the built-in gpuAcceleration so that
              // Popper.js will return us easy to interpolate values
              // (top, left instead of transform: translate3d)
              // We'll then use these values to generate the needed
              // css tranform values blended with the react-spring values
              computeStyle: { gpuAcceleration: false },
              preventOverflow: { enabled: true },
            } as any
          }>
          {({ ref, style: { top, left, position }, placement, arrowProps }) =>
            createPortal(
              <PopupBox
                className={className}
                style={style}
                id={id}
                ref={ref}
                data-placement={placement}
                transitionProps={transitionProps}
                position={position}
                top={top}
                left={left}>
                {children}
                <PopupArrow
                  ref={arrowProps.ref}
                  data-placement={placement}
                  style={arrowProps.style}
                />
              </PopupBox>,
              document.body,
            )
          }
        </UnstyledPopup>
      ),
  )
}
