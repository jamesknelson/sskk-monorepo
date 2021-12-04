import { createContext, useContext } from 'react'

import { FormSnapshot, FormModel } from './formTypes'

export const formContext = createContext<FormSnapshot<any>>(undefined as any)

export const formModelContext = createContext<FormModel<any, any, any, any>>(
  undefined as any,
)

export function useFormContext(): FormSnapshot<any> {
  return useContext(formContext)
}

export function useFormModelContext() {
  return useContext(formModelContext)
}
