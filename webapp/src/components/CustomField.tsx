import { Input } from 'antd'
import * as React from 'react'
import { FieldInputProps, FormikState } from 'formik'

interface ICustomInput {
  field: FieldInputProps<any>
  form: FormikState<any>
  onBlur(): void
  onFocus(): void
  onKeyDown(): void
}

export const CustomInput = (props: ICustomInput) => {
  const { form, field, onBlur, onFocus, onKeyDown, ...formProps } = props
  return <Input {...field} {...formProps} onBlur={onBlur} onFocus={onFocus} onKeyDown={onKeyDown} />
}
