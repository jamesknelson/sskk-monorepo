import React, { forwardRef, useMemo } from 'react'
import { useHasHydrated } from 'retil-hydration'
import {
  ActionSurfaceOptions,
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
import { FormStatus } from './formTypes'

export interface FormSubmitButtonSurfaceProps
  // Note that we've removed "type", as we don't want to support submit
  // buttons. They behave differently, so they deserve a separate surface.
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'children' | 'type'
    >,
    ActionSurfaceOptions {
  children: React.ReactNode | ((status: FormStatus) => React.ReactNode)
  enableBeforeHydration?: boolean
}

export const FormSubmitButtonSurface = forwardRef<
  HTMLButtonElement,
  FormSubmitButtonSurfaceProps
>((props, ref) => {
  const [
    actionSurfaceOptions,
    { children, enableBeforeHydration, onClick, ...rest },
  ] = splitActionSurfaceOptions(props)

  const { status, model } = useFormContext()
  const isComplete = status === 'complete'
  const isSubmitting = status === 'busy'

  // By default, we'll disable the form during hydration to prevent accidental
  // submits. To enable the form anyway, pass an `enableBeforeHydration` prop.
  const isHydrating = !useHasHydrated() && !enableBeforeHydration

  const [actionSurfaceState, mergeActionSurfaceProps, provideActionSurface] =
    useActionSurfaceConnector({
      ...actionSurfaceOptions,
      disabled: isComplete || isSubmitting || actionSurfaceOptions.disabled,
      overrideSelectors: mergeOverrides(
        [
          [inHydratingSurface, !!isHydrating],
          [inInvalidSurface, !!model.issues.length],
          [inWorkingSurface, isSubmitting],
        ],
        actionSurfaceOptions.overrideSelectors,
      ),
    })

  const handleClick = useJoinedEventHandler(
    onClick,
    actionSurfaceState.disabled ? preventDefaultEventHandler : undefined,
  )

  const content = useMemo(
    () => (typeof children === 'function' ? children(status) : children),
    [children, status],
  )

  return provideActionSurface(
    <button
      {...mergeActionSurfaceProps({
        ...rest,
        children: content,
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
