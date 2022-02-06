import produce from 'immer'
import get from 'lodash/get'
import set from 'lodash/set'
import React, { useCallback, useMemo, useState } from 'react'
import {
  CodesByPath,
  Issue,
  IssuePath,
  useIssues,
  useValidator,
} from 'retil-issues'
import { useOperation } from 'retil-operation'
import {
  emptyArray,
  useJoinedEventHandler,
  useFirstInstanceOfLatestValue,
} from 'retil-support'

import { useFormModelContext } from './formContext'
import {
  UseFormSnapshot,
  FormModel,
  FormModelPath,
  FormModelRoot,
  UseFormOptions,
  FormStatus,
} from './formTypes'

/**
 * Utility to memoize model and infer types.
 */
export function useFormModel<
  TValue extends object,
  TCodes extends CodesByPath<TValue>,
>(
  model: Omit<FormModel<TValue, TValue, TCodes, []>, 'path'>,
): FormModel<TValue, TValue, TCodes, []> {
  const { issues, update, validate, validateOnBlur, value } = model

  return useMemo(
    () => ({
      issues,
      path: emptyArray as [],
      update,
      validate,
      validateOnBlur,
      value,
    }),
    [issues, update, validate, validateOnBlur, value],
  )
}

const noIssues = [] as Issue<any, any>[]

export interface UseFormModelPathOptions<TFormValue extends object> {
  onBlur?: (
    event: React.FocusEvent<any>,
    path: FormModelPath<TFormValue>,
  ) => void
  onFocus?: (
    event: React.FocusEvent<any>,
    path: FormModelPath<TFormValue>,
  ) => void
}

export function useFormModelPath<
  TFormValue extends object,
  TCodes extends CodesByPath<TFormValue>,
  TFieldPath extends FormModelPath<TFormValue>,
>(
  model: FormModelRoot<TFormValue, TCodes>,
  path: TFieldPath,
  options?: UseFormModelPathOptions<TFormValue>,
): FormModel<TFormValue[TFieldPath[0]], TFormValue, TCodes, TFieldPath>
export function useFormModelPath<
  TParentFieldValue extends object,
  TFormValue extends object,
  TCodes extends CodesByPath<TFormValue>,
  TParentFieldPath extends FormModelPath<TFormValue>,
  TFieldPath extends FormModelPath<TParentFieldValue>,
>(
  model: FormModel<TParentFieldValue, TFormValue, TCodes, TParentFieldPath>,
  path: TFieldPath,
  options?: UseFormModelPathOptions<TFormValue>,
): FormModel<
  TParentFieldValue[TFieldPath[0]],
  TFormValue,
  TCodes,
  TParentFieldPath
>
export function useFormModelPath<
  TParentFieldValue extends object,
  TFormValue extends object,
  TCodes extends CodesByPath<TFormValue>,
  TParentFieldPath extends [] | FormModelPath<TFormValue>,
  TFieldPath extends FormModelPath<TParentFieldValue>,
>(
  model: FormModel<TParentFieldValue, TFormValue, TCodes, TParentFieldPath>,
  unmemoizedPath: TFieldPath,
  options: UseFormModelPathOptions<TFormValue> = {},
): FormModel<
  TParentFieldValue[TFieldPath[0]],
  TFormValue,
  TCodes,
  FormModelPath<TFormValue>
> {
  const {
    onBlur: onBlurProp = model.onBlur,
    onFocus: onFocusProp = model.onFocus,
  } = options

  const relativePath = useFirstInstanceOfLatestValue(unmemoizedPath)
  const absolutePath = [...model.path].concat(
    relativePath,
  ) as FormModelPath<TFormValue>

  const modelUpdate = model.update
  const modelValidate = model.validate

  const validate = useCallback(
    () => modelValidate(relativePath[0] as IssuePath<TCodes>),
    [relativePath, modelValidate],
  )

  const onBlur = useMemo(
    () =>
      onBlurProp
        ? (event: React.FocusEvent<any>) => onBlurProp(event, absolutePath)
        : undefined,
    [absolutePath, onBlurProp],
  )
  const onFocus = useMemo(
    () =>
      onFocusProp
        ? (event: React.FocusEvent<any>) => onFocusProp(event, absolutePath)
        : undefined,
    [absolutePath, onFocusProp],
  )

  const update = useCallback(
    (updaterOrValue: unknown) => {
      modelUpdate((state) =>
        produce(state, (draft) => {
          set(
            draft,
            relativePath,
            typeof updaterOrValue === 'function'
              ? updaterOrValue(get(state, relativePath))
              : updaterOrValue,
          )
        }),
      )
    },
    [relativePath, modelUpdate],
  )

  const value = get(model.value, relativePath)

  const issues = useMemo(() => {
    const relevantIssues = model.issues.filter(
      (issue) => issue.path && issue.path === relativePath[0],
    )
    // Return a constant array when there are no issues, as it makes
    // memoization of error-free fields simpler
    return relevantIssues.length === 0
      ? (noIssues as Issue<TFormValue, TCodes>[])
      : relevantIssues
  }, [relativePath, model.issues])

  const fieldModel = useMemo(
    () => ({
      issues,
      path: absolutePath,
      update,
      validate,
      value,
      onBlur,
      onFocus,
    }),
    [issues, absolutePath, update, validate, value, onBlur, onFocus],
  )

  return fieldModel
}

export interface FormModelInputProps {
  name?: string
  onBlur?: (any?: any) => void
  onFocus?: (any?: any) => void
  onChange?: (value: any) => void
  value?: any
  validateOnBlur?: boolean
}

export function useFormModelInput<
  TFieldValue,
  TFormValue extends object,
  TCodes extends CodesByPath<TFormValue>,
  TPath extends [] | FormModelPath<TFormValue>,
>(
  model: FormModel<TFieldValue, TFormValue, TCodes, TPath>,
  options: FormModelInputProps = {},
): readonly [FormModelInputProps, Issue<any>[]] {
  const { validateOnBlur: defaultValidateOnBlur = false } =
    useFormModelContext() || {}

  const {
    name = model.path[0],
    onBlur: onBlurProp,
    onChange,
    onFocus: onFocusProp,
    value = model.value,
    validateOnBlur = defaultValidateOnBlur,
  } = options

  const blurValidationHandler = validateOnBlur ? model.validate : undefined
  const handleBlurProp = useJoinedEventHandler(onBlurProp, model.onBlur)
  const handleBlur = useJoinedEventHandler(
    handleBlurProp,
    blurValidationHandler,
  )
  const handleFocus = useJoinedEventHandler(onFocusProp, model.onFocus)
  const handleChange = useMemo(
    () =>
      onChange && model.update
        ? (value: any) => {
            onChange(value)
            model.update!(value)
          }
        : onChange || model.update,
    [onChange, model.update],
  )

  const inputProps = useMemo(() => {
    return {
      name,
      value,
      onBlur: handleBlur,
      onChange: handleChange,
      onFocus: handleFocus,
    }
  }, [handleBlur, handleChange, handleFocus, name, value])

  return [inputProps, model.issues || noIssues]
}

export function useForm<
  TValue extends object = any,
  TCodes extends CodesByPath<TValue> = CodesByPath<TValue>,
  TResult = void,
>(
  props: UseFormOptions<TValue, TCodes, TResult> & Record<string, any>,
): UseFormSnapshot<TValue, TCodes, TResult> {
  const {
    initialValue,

    onValidate,
    onSubmit,

    areValuesEqual,
    areValuePathsEqual,
    attemptResolutionOnChange,
    getMessage,

    canSubmitAfterSuccessfulResult = false,
    validateOnBlur = false,

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
    validateOnBlur,
  })

  const [submit, submitPending, result] = useOperation(
    (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) {
        event.preventDefault()
      }
      const result = onSubmit({
        event: event || null,
        ...handle,
      })
      return result
    },
  )

  const [status, setStatus] = useState<FormStatus>('ready')
  if (submitPending === false && status === 'busy') {
    setStatus(
      issues.length || canSubmitAfterSuccessfulResult ? 'ready' : 'complete',
    )
  } else if (submitPending === true && status !== 'busy') {
    setStatus('busy')
  }

  const reset = useCallback(() => {
    clearIssues()
    update(() => initialValue)
    setStatus('ready')
  }, [clearIssues, initialValue])

  const handle: UseFormSnapshot<TValue, TCodes, TResult> = {
    addIssues,
    clearIssues,
    clearValidationIssues,
    model,
    props: rest,
    reset,
    result,
    status,
    submit,
    update,
    validate,
  }

  return handle
}
