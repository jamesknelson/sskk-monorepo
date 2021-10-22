import produce from 'immer'
import get from 'lodash/get'
import set from 'lodash/set'
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { useHasHydrated } from 'retil-hydration'
import {
  ActionSurfaceOptions,
  createSurfaceSelector,
  inFocusedSurface,
  inHoveredSurface,
  inHydratingSurface,
  inInvalidSurface,
  SurfaceSelectorOverrides,
  mergeOverrides,
  splitActionSurfaceOptions,
  useActionSurfaceConnector,
  useDisableableConnector,
  useSurfaceSelectorsConnector,
  inWorkingSurface,
} from 'retil-interaction'
import {
  AddIssuesFunction,
  ClearIssuesFunction,
  DefaultIssueCodes,
  GetIssueMessage,
  Issue,
  IssueCodes,
  IssuePath,
  Validator,
  useIssues,
  useValidator,
} from 'retil-issues'
import { useOperation } from 'retil-operation'
import {
  preventDefaultEventHandler,
  useJoinedEventHandler,
} from 'retil-support'
import type { Object } from 'ts-toolbelt'

export const inCompleteSurface = /*#__PURE__*/ createSurfaceSelector(false)

export const rootModelPath = Symbol('root')
export type RootModelPath = typeof rootModelPath

// TODO: allow for nested types, using template literal types, e.g.
// https://github.com/millsp/ts-toolbelt/blob/master/sources/Function/AutoPath.ts
export type FormModelPaths<TValue extends object> = Extract<
  keyof TValue,
  string
>

export type FormStatus = 'ready' | 'busy' | 'complete'

// TODO: update these two interfaces to support nested paths, and for
// ModelPath to be a true model that can itself have a nested model.
// This would probably require the model TValue param to not extend "object".
export interface FormModel<TValue extends object, TCodes extends IssueCodes> {
  issues: Issue<TValue, TCodes>[]
  path: RootModelPath
  value: TValue

  update: (updater: TValue | ((value: TValue) => TValue)) => void
  validate: (path?: IssuePath<TCodes>) => Promise<boolean>
}
export interface FormFieldModel<
  Value extends object,
  Codes extends IssueCodes,
  Path extends FormModelPaths<Value>,
> {
  // Note: this does not include the parent model's value/issues, as including
  // these would mean that changing any model path in a form would require new
  // objects be created for *all* model paths, significantly increasing the
  // difficulty of performance optimization. However it still uses the the
  // `Value` type, as issues objects also store a value/path pair.

  issues: Issue<Value, Codes>[]
  path: Path
  value: Value[Path]

  update: (updater: Value[Path] | ((value: Value[Path]) => Value[Path])) => void
  validate: (path?: IssuePath<Codes>) => Promise<boolean>
}

export const FormFieldModelContext = createContext<null | FormFieldModel<
  any,
  any,
  any
>>(null)

/**
 * Utility to memoize model and infer types.
 */
export function useFormModel<Value extends object, Codes extends IssueCodes>(
  model: Omit<FormModel<Value, Codes>, 'path'>,
): FormModel<Value, Codes> {
  const { issues, update, validate, value } = model

  return useMemo(
    () => ({
      issues,
      path: rootModelPath,
      update,
      validate,
      value,
    }),
    [issues, update, validate, value],
  )
}

const noIssues = [] as Issue<any, any>[]

// TODO: types for the returned model. This means `Value` can be anything, but
// that currently breaks Issue types.
export function useFormFieldModel<
  Value extends object,
  Codes extends IssueCodes,
  Path extends FormModelPaths<Value>,
>(
  model: FormModel<Value, Codes>,
  path: Path,
): FormFieldModel<Value, Codes, Path> {
  const modelUpdate = model.update
  const modelValidate = model.validate

  const validate = useCallback(
    () => modelValidate(path as IssuePath<Codes>),
    [path, modelValidate],
  )

  const update = useCallback(
    (updaterOrValue: unknown) => {
      modelUpdate((state) =>
        produce(state, (draft) => {
          set(
            draft,
            path,
            typeof updaterOrValue === 'function'
              ? updaterOrValue(get(state, path))
              : updaterOrValue,
          )
        }),
      )
    },
    [path, modelUpdate],
  )

  const value = get(model.value, path)

  const issues = useMemo(() => {
    const relevantIssues = model.issues.filter(
      (issue) => issue.path && issue.path.slice(0, path.length) === path,
    )
    // Return a constant array when there are no issues, as it makes
    // memoization of error-free fields simpler
    return relevantIssues.length === 0
      ? (noIssues as Issue<Value, Codes>[])
      : relevantIssues
  }, [path, model.issues])

  const fieldModel = useMemo(
    () => ({
      issues,
      path,
      update,
      validate,
      value,
    }),
    [issues, path, update, validate, value],
  )

  return fieldModel
}

const emptyModelPath = {} as Partial<FormFieldModel<any, any, any>>

export function useFormModelContext() {
  return useContext(FormFieldModelContext) || emptyModelPath
}

export interface FormModelInputProps {
  name?: string
  onBlur?: (any?: any) => void
  onChange?: (value: any) => void
  value?: any
  validateOnBlur?: boolean
}

export function useFormModelInput(
  options: FormModelInputProps = {},
): readonly [FormModelInputProps, Issue<any>[]] {
  const modelPath = useFormModelContext()
  const { validateOnBlur: defaultValidateOnBlur } = useContext(formContext)

  const {
    name = modelPath.path,
    onBlur,
    onChange,
    value = modelPath.value,
    validateOnBlur = defaultValidateOnBlur,
  } = options

  const blurValidationHandler = validateOnBlur ? modelPath.validate : undefined
  const handleBlur = useJoinedEventHandler(onBlur, blurValidationHandler)
  const handleChange = useMemo(
    () =>
      onChange && modelPath.update
        ? (value: any) => {
            onChange(value)
            modelPath.update!(value)
          }
        : onChange || modelPath.update,
    [onChange, modelPath.update],
  )

  const inputProps = useMemo(() => {
    return {
      name,
      value,
      onBlur: handleBlur,
      onChange: handleChange,
    }
  }, [handleBlur, handleChange, name, value])

  return [inputProps, modelPath.issues || noIssues]
}

interface FormPropsExt<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = void,
> {
  children:
    | React.ReactNode
    | ((handle: FormHandle<TValue, TCodes>) => React.ReactNode)

  initialValue: TValue
  onValidate: Validator<TValue, TCodes>
  onSubmit: (input: FormSubmitInput<TValue, TCodes>) => Promise<TResult>

  disabled?: boolean

  areValuesEqual?: (x: TValue, y: TValue) => boolean
  areValuePathsEqual?: (x: TValue, y: TValue, path: string) => boolean
  attemptResolutionOnChange?: boolean
  getMessage?: GetIssueMessage<TValue, TCodes>

  canSubmitAfterSuccessfulResult?: boolean
  validateOnBlur?: boolean
}

const formContext = createContext<FormContext<any, any, any>>(undefined as any)

export interface FormHandle<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
> {
  addIssues: AddIssuesFunction<TValue, TCodes>
  clearIssues: ClearIssuesFunction
  clearValidationIssues: () => void
  update: React.Dispatch<React.SetStateAction<TValue>>
  validate: (path?: IssuePath<TCodes>) => Promise<boolean>
}

export interface FormSubmitInput<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
> extends FormHandle<TValue, TCodes> {
  // Is null when imperatively submitted.
  event: React.FormEvent<HTMLFormElement> | null
  model: FormModel<TValue, TCodes>
}

export interface FormContext<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = any,
> {
  model: FormModel<TValue, TCodes>
  handle: FormHandle<TValue, TCodes>
  reset: () => void
  result: TResult | undefined
  submit: () => Promise<TResult>
  status: FormStatus

  validateOnBlur?: boolean
}

export function useFormContext() {
  return useContext(formContext)
}

export type FormProps<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = void,
> = FormPropsExt<TValue, TCodes, TResult> &
  Omit<JSX.IntrinsicElements['form'], 'children' | 'onSubmit' | 'ref'> &
  React.RefAttributes<HTMLFormElement> & {
    handleRef?: React.Ref<FormHandle<TValue, TCodes>>
  }

interface FormType {
  <
    TValue extends object = any,
    TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
    TResult = void,
  >(
    props: FormProps<TValue, TCodes, TResult>,
  ): null | React.ReactElement
}

const FormForwardRefRenderCallback = <
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = void,
>(
  props: FormProps<TValue, TCodes, TResult>,
  ref: React.ForwardedRef<HTMLFormElement>,
) => {
  const {
    children,
    disabled,
    initialValue,

    onValidate,
    onSubmit,

    areValuesEqual,
    areValuePathsEqual,
    attemptResolutionOnChange,
    getMessage,

    canSubmitAfterSuccessfulResult = false,
    validateOnBlur = false,

    handleRef,

    ...rest
  } = props

  const [value, update] = useState<TValue>(initialValue)

  const [issues, addIssues, clearIssues] = useIssues<TValue, TCodes>(value, {
    areValuesEqual,
    areValuePathsEqual,
    attemptResolutionOnChange,
    getMessage,
  })

  const [validate, clearValidationIssues] = useValidator(addIssues, onValidate)

  const model = useFormModel({
    issues,
    value,
    update,
    validate,
  })

  const handle: FormHandle<TValue, TCodes> = useMemo(
    () => ({
      addIssues,
      clearIssues,
      clearValidationIssues,
      update,
      validate,
    }),
    [addIssues, clearIssues, clearValidationIssues, update, validate],
  )

  useImperativeHandle(handleRef, () => handle, [handle])

  const [handleSubmit, submitPending, result] = useOperation(
    (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) {
        event.preventDefault()
      }
      const result = onSubmit({
        event: event || null,
        model,
        ...handle,
      })
      return result
    },
    [handle, model, onSubmit],
  )

  const [status, setStatus] = useState<FormStatus>('ready')
  if (submitPending === false && status === 'busy') {
    setStatus(
      issues.length || canSubmitAfterSuccessfulResult ? 'ready' : 'complete',
    )
  }

  const submit = useCallback(() => handleSubmit(undefined), [handleSubmit])

  const reset = useCallback(() => {
    clearIssues()
    update(() => initialValue)
    setStatus('ready')
  }, [clearIssues, initialValue])

  const context: FormContext<TValue, TCodes, TResult> = useMemo(
    () => ({
      model,
      handle,
      reset,
      result,
      status,
      submit,
      validateOnBlur,
    }),
    [model, handle, reset, result, status, submit, validateOnBlur],
  )

  return (
    <form ref={ref} onSubmit={handleSubmit} {...rest}>
      <formContext.Provider value={context}>
        {useMemo(
          () => (typeof children === 'function' ? children(handle) : children),
          [children, handle],
        )}
      </formContext.Provider>
    </form>
  )
}

export const Form: FormType = forwardRef<
  HTMLFormElement,
  FormProps<any, any, any>
>(FormForwardRefRenderCallback)

export type FormFieldProviderChildFunction<
  Value extends object,
  Codes extends IssueCodes,
  Path extends FormModelPaths<Value>,
> = (modelPath: FormFieldModel<Value, Codes, Path>) => React.ReactElement

export interface FormFieldProps<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends FormModelPaths<Value> = FormModelPaths<object>,
> {
  model?: FormModel<Value, Codes>
  path: Path
}

export interface FormFieldProviderProps<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends FormModelPaths<Value> = FormModelPaths<object>,
> extends FormFieldProps<Value, Codes, Path> {
  children: React.ReactNode | FormFieldProviderChildFunction<Value, Codes, Path>
}

// By putting our model in context, it's possible to separate form controls
// into composable parts - e.g. a field wrapping an input.
export function FormFieldProvider<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends FormModelPaths<Value> = FormModelPaths<object>,
>({ children, model, path }: FormFieldProviderProps<Value, Codes, Path>) {
  const form = useFormContext()
  const modelPath = useFormFieldModel(model || form.model, path)
  const content = useMemo(
    () => (typeof children === 'function' ? children(modelPath) : children),
    [children, modelPath],
  )
  return useMemo(
    () => (
      <FormFieldModelContext.Provider value={modelPath}>
        {content}
      </FormFieldModelContext.Provider>
    ),
    [modelPath, content],
  )
}

export interface FormFieldSurfaceProps<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends FormModelPaths<Value> = FormModelPaths<object>,
> extends React.ComponentProps<'div'>,
    Omit<FormFieldProps<Value, Codes, Path>, 'children'> {
  disabled?: boolean
  overrideSelectors?: SurfaceSelectorOverrides
}

export type TypedFormFieldSurface<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends FormModelPaths<Value> = FormModelPaths<Value>,
> = React.ForwardRefExoticComponent<FormFieldSurfaceProps<Value, Codes, Path>>

export const FormFieldSurface = forwardRef<
  HTMLDivElement,
  FormFieldSurfaceProps<any, any, any>
>(({ children, disabled, model, path, overrideSelectors, ...rest }, ref) => {
  const form = useContext(formContext)
  const modelPath = useFormFieldModel(model || form.model, path)

  // TODO: a "valid" surface would required that we know that the current
  // value is equal to the most recent validated value.

  const [disableableState, mergeDisableableProps, provideDisableable] =
    useDisableableConnector(disabled)
  const [, mergeSurfaceSelectorProps, provideSurfaceSelectors] =
    useSurfaceSelectorsConnector(
      [
        [inFocusedSurface, ':focus-within'],
        [inHoveredSurface, disableableState.disabled ? false : null],
        [inInvalidSurface, modelPath.issues.length > 0],
      ],
      overrideSelectors,
    )

  return provideDisableable(
    provideSurfaceSelectors(
      <FormFieldModelContext.Provider value={modelPath}>
        <div
          {...mergeDisableableProps(
            mergeSurfaceSelectorProps({
              ...rest,
              ref,
            }),
          )}>
          {children}
        </div>
      </FormFieldModelContext.Provider>,
    ),
  )
})

export interface FormConsumerProps<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends FormModelPaths<Value> = FormModelPaths<object>,
  Selection = FormContext<Value, Codes, Path>,
> {
  children: (selection: Selection) => void
  select?: (value: FormContext<Value, Codes, Path>) => Selection
}

export type TypedFormConsumer<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends FormModelPaths<Value> = FormModelPaths<Value>,
> = React.FunctionComponent<FormConsumerProps<Value, Codes, Path>>

export const FormConsumer = formContext.Consumer

export type TypedForm<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TPath extends FormModelPaths<TValue> = FormModelPaths<TValue>,
  TResult = any,
  TDefaultProps extends object = any,
> = React.ForwardRefExoticComponent<
  Object.Optional<FormProps<TValue, TCodes, TResult>, keyof TDefaultProps>
> & {
  Consumer: TypedFormConsumer<TValue, TCodes, TPath>
  FieldSurface: React.ForwardRefExoticComponent<
    FormFieldSurfaceProps<TValue, TCodes, TPath>
  >
}

export function createForm<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TPath extends FormModelPaths<TValue> = FormModelPaths<TValue>,
  TResult = any,
  TDefaultProps extends object = {},
>(
  defaultProps:
    | Partial<FormProps<TValue, TCodes, TResult>>
    | TDefaultProps = {},
): TypedForm<TValue, TCodes, TPath, TResult, TDefaultProps> {
  const Form: any = forwardRef<HTMLFormElement, FormProps<any, any, any>>(
    FormForwardRefRenderCallback,
  )

  Form.defaultProps = defaultProps
  Form.Consumer = FormConsumer
  Form.FieldSurface = FormFieldSurface

  return Form
}

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
  const formContext = useFormContext()

  const [actionSurfaceState, mergeActionSurfaceProps, provideActionSurface] =
    useActionSurfaceConnector({
      ...actionSurfaceOptions,
      overrideSelectors: mergeOverrides(
        [
          [inHydratingSurface, !!isHydrating],
          [inInvalidSurface, formContext.model.issues.length > 0],
          [inWorkingSurface, formContext.status === 'busy'],
          [inCompleteSurface, formContext.status === 'complete'],
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
