import { forwardRef } from 'react'
import type { Object } from 'ts-toolbelt'

import { Input, InputProps } from 'lib-ui-web/component/input'
import {
  FieldBlock,
  FieldBlockProps,
} from 'lib-ui-web/component/block/fieldBlock'

import { useFormModelContext } from './formContext'
import { useFormModelInput } from './formHooks'

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

export type FormInputProps = Omit<InputProps, 'onChange'> & {
  onChange?: (value: any) => void
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const model = useFormModelContext()
    const [{ onChange, ...inputProps }] = useFormModelInput(model, {
      onChange: props.onChange,
    })

    return <Input ref={ref} {...props} {...inputProps} onChange={onChange} />
  },
)
