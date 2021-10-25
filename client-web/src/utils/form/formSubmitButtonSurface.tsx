import React, { forwardRef } from 'react'
import { useHasHydrated } from 'retil-hydration'
import {
  ActionSurfaceOptions,
  createSurfaceSelector,
  inHydratingSurface,
  inInvalidSurface,
  mergeOverrides,
  splitActionSurfaceOptions,
  useActionSurfaceConnector,
  inWorkingSurface,
} from 'retil-interaction'
import {
  preventDefaultEventHandler,
  useJoinedEventHandler,
} from 'retil-support'

import { useFormContext } from './formContext'

export const inCompleteSurface = /*#__PURE__*/ createSurfaceSelector(false)

export interface FormSubmitButtonSurfaceProps
  // Note that we've removed "type", as we don't want to support submit
  // buttons. They behave differently, so they deserve a separate surface.
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    ActionSurfaceOptions {
  enableBeforeHydration?: boolean
}

export const FormSubmitButtonSurface = forwardRef<
  HTMLButtonElement,
  FormSubmitButtonSurfaceProps
>((props, ref) => {
  const [actionSurfaceOptions, { enableBeforeHydration, onClick, ...rest }] =
    splitActionSurfaceOptions(props)

  // By default, we'll disable the form during hydration to prevent accidental
  // submits. To enable the form anyway, pass an `enableBeforeHydration` prop.
  const isHydrating = !useHasHydrated() && !enableBeforeHydration
  const formHandle = useFormContext()

  const [actionSurfaceState, mergeActionSurfaceProps, provideActionSurface] =
    useActionSurfaceConnector({
      ...actionSurfaceOptions,
      overrideSelectors: mergeOverrides(
        [
          [inHydratingSurface, !!isHydrating],
          [inInvalidSurface, !!formHandle?.model.issues.length],
          [inWorkingSurface, formHandle?.status === 'busy'],
          [inCompleteSurface, formHandle?.status === 'complete'],
        ],
        actionSurfaceOptions.overrideSelectors,
      ),
    })

  const handleClick = useJoinedEventHandler(
    onClick,
    actionSurfaceState.disabled ? preventDefaultEventHandler : undefined,
  )

  return provideActionSurface(
    <button
      {...mergeActionSurfaceProps({
        ...rest,
        onClick: handleClick,
        ref,
      })}
      // Disable the form until the app has hydrated and we're able to
      // programatically disable the form if required. Apply a hydrating
      // surface selector instead of a `disabled` one.
      disabled={isHydrating}
      type="submit"
    />,
  )
})
