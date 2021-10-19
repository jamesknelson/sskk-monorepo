import produce from 'immer'
import get from 'lodash/get'
import set from 'lodash/set'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
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

export const rootModelPath = Symbol('root')
export type RootModelPath = typeof rootModelPath

// TODO: allow for nested types, using template literal types, e.g.
// https://github.com/millsp/ts-toolbelt/blob/master/sources/Function/AutoPath.ts
export type ModelPaths<TValue extends object> = Extract<keyof TValue, string>

// TODO: update these two interfaces to support nested paths, and for
// ModelPath to be a true model that can itself have a nested model.
// This would probably require the model TValue param to not extend "object".
export interface Model<TValue extends object, TCodes extends IssueCodes> {
  issues: Issue<TValue, TCodes>[]
  path: RootModelPath
  value: TValue

  update: (updater: TValue | ((value: TValue) => TValue)) => void
  validate: (path?: IssuePath<TCodes>) => Promise<boolean>
}
export interface ModelPath<
  Value extends object,
  Codes extends IssueCodes,
  Path extends ModelPaths<Value>,
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

export const ModelPathContext = createContext<null | ModelPath<any, any, any>>(
  null,
)

/**
 * Utility to memoize model and infer types.
 */
export function useModel<Value extends object, Codes extends IssueCodes>(
  model: Omit<Model<Value, Codes>, 'path'>,
): Model<Value, Codes> {
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
export function useModelPath<
  Value extends object,
  Codes extends IssueCodes,
  Path extends ModelPaths<Value>,
>(model: Model<Value, Codes>, path: Path): ModelPath<Value, Codes, Path> {
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

  const pathModel = useMemo(
    () => ({
      issues,
      path,
      update,
      validate,
      value,
    }),
    [issues, path, update, validate, value],
  )

  return pathModel
}

export type ProvideChildFunction<
  Value extends object,
  Codes extends IssueCodes,
  Path extends ModelPaths<Value>,
> = (modelPath: ModelPath<Value, Codes, Path>) => React.ReactElement

export interface ProvideProps<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends ModelPaths<Value> = ModelPaths<object>,
> {
  children: React.ReactNode | ProvideChildFunction<Value, Codes, Path>
  model?: Model<Value, Codes>
  path: Path
}

// By putting our model in context, it's possible to separate form controls
// into composable parts - e.g. a field wrapping an input.
export function Provide<
  Value extends object = any,
  Codes extends IssueCodes = DefaultIssueCodes<Value>,
  Path extends ModelPaths<Value> = ModelPaths<object>,
>({ children, model, path }: ProvideProps<Value, Codes, Path>) {
  const form = useContext(formContext)
  const modelPath = useModelPath(model || form.model, path)
  const content = useMemo(
    () => (typeof children === 'function' ? children(modelPath) : children),
    [children, modelPath],
  )
  return useMemo(
    () => (
      <ModelPathContext.Provider value={modelPath}>
        {content}
      </ModelPathContext.Provider>
    ),
    [modelPath, content],
  )
}

const emptyModelPath = {} as Partial<ModelPath<any, any, any>>

export function useModelPathContext() {
  return useContext(ModelPathContext) || emptyModelPath
}

export interface ModelInputProps {
  name?: string
  onBlur?: (any?: any) => void
  onChange?: (value: any) => void
  value?: any
}

export function useModelInput(
  options: ModelInputProps = {},
): readonly [ModelInputProps, Issue<any>[]] {
  const modelPath = useModelPathContext()

  const {
    name = modelPath.path,
    onBlur,
    onChange,
    value = modelPath.value,
  } = options

  const handleBlur = useMemo(
    () =>
      onBlur && modelPath.validate
        ? (event?: any) => {
            onBlur(event as any)
            if (event && !event.defaultPrevented) {
              modelPath.validate!()
            }
          }
        : onBlur || modelPath.validate,
    [onBlur, modelPath.validate],
  )

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

export interface FormProps<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = void,
> {
  // The function form doesn't provide any extra functionality at runtime, but
  // does allow for a typed Provide function.
  children:
    | React.ReactNode
    | ((
        Provide: <TPath extends ModelPaths<TValue>>(
          props: Omit<ProvideProps<TValue, TCodes, TPath>, 'model'>,
        ) => React.ReactElement,
        handle: FormHandle<TValue, TCodes>,
      ) => React.ReactNode)

  initialValue: TValue
  onValidate: Validator<TValue, TCodes>
  onSubmit: (input: FormSubmitInput<TValue, TCodes>) => Promise<TResult>

  disabled?: boolean

  areValuesEqual?: (x: TValue, y: TValue) => boolean
  areValuePathsEqual?: (x: TValue, y: TValue, path: string) => boolean
  attemptResolutionOnChange?: boolean
  getMessage?: GetIssueMessage<TValue, TCodes>
}

const formContext = createContext<FormContext<any, any, any>>(undefined as any)

// Note: does not include `submit`, as this would require a new handle to be
// passed into any render function on each update, thus causing *every* form
// field to be re-rendered on each keystroke.
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
  model: Model<TValue, TCodes>
}

export interface FormContext<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = any,
> {
  model: Model<TValue, TCodes>
  handle: FormHandle<TValue, TCodes>
  submit: () => Promise<TResult>
  submitPending: boolean
  submitResult: TResult | undefined
}

export function Form<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = void,
>(
  props: FormProps<TValue, TCodes, TResult> &
    Omit<JSX.IntrinsicElements['form'], 'children' | 'onSubmit'>,
) {
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
  const model = useModel({
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

  const [handleSubmit, submitPending, submitResult] = useOperation(
    (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) {
        event.preventDefault()
      }
      return onSubmit({
        event: event || null,
        model,
        ...handle,
      })
    },
    [handle, model, onSubmit],
  )

  const submit = useCallback(() => handleSubmit(undefined), [handleSubmit])

  const context: FormContext<TValue, TCodes, TResult> = useMemo(
    () => ({
      model,
      handle,
      submit,
      submitPending,
      submitResult,
    }),
    [model, handle, submit, submitPending, submitResult],
  )

  return (
    <form onSubmit={handleSubmit} {...rest}>
      <formContext.Provider value={context}>
        {useMemo(
          () =>
            typeof children === 'function'
              ? children(Provide as any, handle)
              : children,
          [children, handle],
        )}
      </formContext.Provider>
    </form>
  )
}
