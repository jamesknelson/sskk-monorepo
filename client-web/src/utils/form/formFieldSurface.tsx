import React, { forwardRef } from 'react'
import {
  inFocusedSurface,
  inHoveredSurface,
  inInvalidSurface,
  SurfaceSelectorOverrides,
  useDisableableConnector,
  useSurfaceSelectorsConnector,
} from 'retil-interaction'
import { ensureTruthyArray } from 'retil-support'

import { formModelContext, useFormModelContext } from './formContext'
import { useFormModelPath } from './formHooks'
import { FormModel, FormModelPath } from './formTypes'

export interface FormFieldSurfaceProps<
  TValue extends object = any,
  TModel extends FormModel<TValue> = FormModel<TValue>,
> extends React.ComponentProps<'div'> {
  disabled?: boolean
  model?: TModel | FormModel<TValue>
  path: Extract<keyof TValue, string> | FormModelPath<TValue>
  overrideSelectors?: SurfaceSelectorOverrides
}

export type TypedFormFieldSurface<
  TValue extends object = any,
  TModel extends FormModel<TValue> = FormModel<TValue>,
> = React.ForwardRefExoticComponent<FormFieldSurfaceProps<TValue, TModel>>

export const FormFieldSurface = forwardRef<
  HTMLDivElement,
  FormFieldSurfaceProps<any, FormModel<any>>
>(
  (
    { children, disabled, model: modelProp, path, overrideSelectors, ...rest },
    ref,
  ) => {
    const parentModelDefault = useFormModelContext()
    const parentModel = (modelProp || parentModelDefault) as FormModel<any>
    const pathArray = ensureTruthyArray(path) as FormModelPath<any>

    // TODO:
    // implement valid selector
    // - validate on update in an effect with displayed: false, so that
    //   we know that there are issues even if they're not immediately
    //   displayed to the user
    // - add a blur handler, and if there are no validation issues,
    //   set `inValidSurface` to true by setting some state
    const fieldModel = useFormModelPath(parentModel, pathArray)

    const [disableableState, mergeDisableableProps, provideDisableable] =
      useDisableableConnector(disabled)
    const [, mergeSurfaceSelectorProps, provideSurfaceSelectors] =
      useSurfaceSelectorsConnector(
        [
          [inFocusedSurface, ':focus-within'],
          [inHoveredSurface, disableableState.disabled ? false : null],
          [inInvalidSurface, parentModel.issues.length > 0],
        ],
        overrideSelectors,
      )

    return provideDisableable(
      provideSurfaceSelectors(
        <formModelContext.Provider value={fieldModel}>
          <div
            {...mergeDisableableProps(
              mergeSurfaceSelectorProps({
                ...rest,
                ref,
              }),
            )}>
            {children}
          </div>
        </formModelContext.Provider>,
      ),
    )
  },
)
