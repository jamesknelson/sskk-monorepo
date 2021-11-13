import { forwardRef } from 'react'

import { Input, InputProps } from 'src/components/web/input'
import { useFormModelContext, useFormModelInput } from 'src/utils/form'

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
