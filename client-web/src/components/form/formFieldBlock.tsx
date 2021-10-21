import { forwardRef } from 'react'
import type { Object } from 'ts-toolbelt'

import { FieldBlock, FieldBlockProps } from 'src/presentation/fieldBlock'
import { useFormModelContext } from 'src/utils/form'

export type FormFieldBlockProps = Omit<
  Object.Optional<FieldBlockProps, 'label'>,
  'ref'
>

export const FormFieldBlock = forwardRef<HTMLDivElement, FormFieldBlockProps>(
  (props, ref) => {
    const { issues, path } = useFormModelContext()
    const { issue = issues?.[0]?.message, label = path, ...rest } = props
    return <FieldBlock ref={ref} label={label} issue={issue} {...rest} />
  },
)
