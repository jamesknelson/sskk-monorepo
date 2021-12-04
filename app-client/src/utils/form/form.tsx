import React, { forwardRef, useImperativeHandle } from 'react'
import { DefaultIssueCodes, IssueCodes } from 'retil-issues'
import { useFormContext, useFormModelContext } from '.'

import { formContext, formModelContext } from './formContext'
import { FormFieldSurface, FormFieldSurfaceProps } from './formFieldSurface'
import { useForm } from './formHooks'
import {
  FormIssuesConsumer,
  TypedFormIssuesConsumer,
} from './formIssuesConsumer'
import {
  FormModelRoot,
  FormPassthroughProps,
  FormSnapshot,
  UseFormSnapshot,
  UseFormOptions,
} from './formTypes'

type FormCommonProps<TSnapshot extends FormSnapshot<any>> =
  React.RefAttributes<HTMLFormElement> & {
    children: React.ReactNode
    snapshotRef?: React.Ref<TSnapshot>
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

const useForwardRefRenderCallback = (
  props: FormCommonProps<any> & Record<string, any>,
  ref: React.ForwardedRef<HTMLFormElement>,
  formHook: (options: any) => UseFormSnapshot<any, any, any>,
): React.ReactElement => {
  const { children, snapshotRef, ...rest } = props

  const snapshot = formHook(rest)

  useImperativeHandle(snapshotRef, () => snapshot)

  return (
    <form ref={ref} onSubmit={snapshot.submit} {...snapshot.props}>
      <formContext.Provider value={snapshot}>
        <formModelContext.Provider value={snapshot.model}>
          {children}
        </formModelContext.Provider>
      </formContext.Provider>
    </form>
  )
}

export type FormProps<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = void,
> = UseFormOptions<TValue, TCodes, TResult> &
  FormCommonProps<UseFormSnapshot<TValue, TCodes, TResult>>

export const Form: FormType = forwardRef<
  HTMLFormElement,
  FormProps<any, any, any>
>((props: FormProps<any, any, any>, ref: React.ForwardedRef<HTMLFormElement>) =>
  useForwardRefRenderCallback(props, ref, useForm),
)

export type TypedForm<
  TValue extends object,
  TCodes extends IssueCodes,
  TOptions,
  TModel extends FormModelRoot<TValue, TCodes>,
  TSnapshot extends FormSnapshot<TModel>,
> = React.ForwardRefExoticComponent<
  TOptions &
    (void extends TOptions ? {} : TOptions) &
    FormCommonProps<TSnapshot>
> & {
  IssuesConsumer: TypedFormIssuesConsumer<TValue, TCodes>
  FieldSurface: React.ForwardRefExoticComponent<FormFieldSurfaceProps<TValue>>

  useSnapshot: TSnapshot
  useModel: TModel
}

export function createForm<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = any,
>(): TypedForm<
  TValue,
  TCodes,
  UseFormOptions<TValue, TCodes, TResult>,
  FormModelRoot<TValue, TCodes>,
  UseFormSnapshot<TValue, TCodes, TResult>
>
export function createForm<
  TValue extends object,
  TCodes extends IssueCodes,
  TModel extends FormModelRoot<TValue, TCodes>,
  TSnapshot extends FormSnapshot<TModel>,
  TOptions = FormPassthroughProps,
>(
  formHook: (
    options: TOptions,
  ) =>
    | TSnapshot
    | FormSnapshot<TModel>
    | FormSnapshot<FormModelRoot<TValue, TCodes>>,
): TypedForm<TValue, TCodes, TOptions, TModel, TSnapshot>
export function createForm<
  TValue extends object,
  TCodes extends IssueCodes,
  TModel extends FormModelRoot<TValue, TCodes>,
  TSnapshot extends FormSnapshot<TModel>,
  TOptions = FormPassthroughProps,
>(
  formHook?: (
    options: TOptions,
  ) =>
    | TSnapshot
    | FormSnapshot<TModel>
    | FormSnapshot<FormModelRoot<TValue, TCodes>>,
): TypedForm<TValue, TCodes, TOptions, TModel, TSnapshot> {
  const Form: any = forwardRef<HTMLFormElement, FormProps<any, any, any>>(
    (props, ref) =>
      useForwardRefRenderCallback(props, ref, (formHook as any) ?? useForm),
  )

  Form.IssuesConsumer = FormIssuesConsumer
  Form.FieldSurface = FormFieldSurface

  Form.useSnapshot = useFormContext
  Form.useModel = useFormModelContext

  return Form
}
