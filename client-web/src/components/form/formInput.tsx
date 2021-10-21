import { forwardRef, useCallback } from 'react'

import { Input, InputProps } from 'src/presentation/inputs'
import { useFormModelInput } from 'src/utils/form'

export type FormInputProps = Omit<InputProps, 'onChange'> & {
  onChange?: (value: any) => void
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const [{ onChange, ...inputProps }] = useFormModelInput({
      onChange: props.onChange,
    })

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(event.target.value)
        }
      },
      [onChange],
    )

    return (
      <Input ref={ref} {...props} {...inputProps} onChange={handleChange} />
    )
  },
)
