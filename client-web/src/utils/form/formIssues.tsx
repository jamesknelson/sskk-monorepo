import React, { useMemo } from 'react'
import { DefaultIssueCodes, Issue, IssueCodes } from 'retil-issues'

import { useFormModelContext } from './formContext'

export interface FormIssuesProps<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
> {
  children: (issues: Issue<TValue, TCodes>[]) => React.ReactNode
}

export type TypedFormIssues<
  TValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TValue>,
> = React.Consumer<Issue<TValue, TCodes>[]>

export function FormIssues<
  TFormValue extends object = any,
  TCodes extends IssueCodes = DefaultIssueCodes<TFormValue>,
>({
  children,
}: FormIssuesProps<TFormValue, TCodes>): null | React.ReactElement {
  const issues = useFormModelContext().issues as Issue<TFormValue, TCodes>[]
  // Memoize on issues and children, so that if the form's value changes but
  // the issues stay the same, the issues will not be re-rendered.
  return <>{useMemo(() => children(issues), [children, issues])}</>
}
