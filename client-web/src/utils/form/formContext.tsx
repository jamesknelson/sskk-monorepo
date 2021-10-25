import { createContext, useContext } from 'react'
import { DefaultIssueCodes, IssueCodes } from 'retil-issues'

import { UseFormSnapshot, FormModel } from './formTypes'

export const formContext = createContext<UseFormSnapshot<any, any, any>>(
  undefined as any,
)

export const formModelContext = createContext<FormModel<any, any, any, any>>(
  undefined as any,
)

export function useFormContext<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
  TResult = any,
>(): UseFormSnapshot<TValue, TCodes, TResult> {
  return useContext(formContext)
}

export function useFormModelContext() {
  return useContext(formModelContext)
}
