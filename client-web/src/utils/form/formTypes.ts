import React from 'react'
import {
  AddIssuesFunction,
  ClearIssuesFunction,
  DefaultIssueCodes,
  GetIssueMessage,
  Issue,
  IssueCodes,
  IssuePath,
  Validator,
} from 'retil-issues'

export type FormPassthroughProps = Omit<
  JSX.IntrinsicElements['form'],
  'onSubmit' | 'ref'
>

export type FormStatus = 'ready' | 'busy' | 'complete'

// TODO: types for nested paths
export type FormModelPath<TValue extends object> = [
  Extract<keyof TValue, string>,
  ...(string | number)[]
]

export interface FormModel<
  TFieldValue = any,
  TFormValue extends object = object,
  TCodes extends IssueCodes = DefaultIssueCodes<TFormValue>,
  TPath extends [] | FormModelPath<TFormValue> = any,
> {
  issues: Issue<TFormValue, TCodes>[]
  path: TPath
  value: TFieldValue

  update: (updater: TFieldValue | ((value: TFieldValue) => TFieldValue)) => void
  validate: (path?: IssuePath<TCodes>) => Promise<boolean>

  onBlur?: (
    event: React.FocusEvent<any>,
    path?: FormModelPath<TFormValue>,
  ) => void
  onFocus?: (
    event: React.FocusEvent<any>,
    path?: FormModelPath<TFormValue>,
  ) => void

  validateOnBlur?: boolean
}

export type FormModelRoot<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
> = FormModel<TValue, TValue, TCodes, []>

export interface FormSnapshot<TModel extends FormModelRoot<any, any>> {
  model: TModel
  props?: FormPassthroughProps
  status: FormStatus
  submit: (event?: React.FormEvent<HTMLFormElement>) => any
}

export interface UseFormOwnOptions<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = void,
> {
  initialValue: TValue
  onValidate: Validator<TValue, TCodes>
  onSubmit: (input: UseFormSubmission<TValue, TCodes>) => Promise<TResult>

  areValuesEqual?: (x: TValue, y: TValue) => boolean
  areValuePathsEqual?: (x: TValue, y: TValue, path: string) => boolean
  attemptResolutionOnChange?: boolean
  getMessage?: GetIssueMessage<TValue, TCodes>

  canSubmitAfterSuccessfulResult?: boolean
  validateOnBlur?: boolean
}
export interface UseFormOptions<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = void,
> extends UseFormOwnOptions<TValue, TCodes, TResult>,
    FormPassthroughProps {}

export interface UseFormSubmission<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
> extends UseFormSnapshot<TValue, TCodes> {
  // Is null when imperatively submitted.
  event: React.FormEvent<HTMLFormElement> | null
}

export interface UseFormSnapshot<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = any,
> extends FormSnapshot<FormModelRoot<TValue, TCodes>> {
  addIssues: AddIssuesFunction<TValue, TCodes>
  clearIssues: ClearIssuesFunction
  clearValidationIssues: () => void
  reset: () => void
  result: TResult | undefined
  submit: (event?: React.FormEvent<HTMLFormElement>) => Promise<TResult>
  update: React.Dispatch<React.SetStateAction<TValue>>
  validate: (path?: IssuePath<TCodes>) => Promise<boolean>
  validateOnBlur?: boolean
}
