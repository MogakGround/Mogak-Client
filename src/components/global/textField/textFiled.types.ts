import { ChangeEvent } from 'react'

export type TextFieldStatus = 'default' | 'hover' | 'error' | 'input' | 'typing' | 'disabled' | 'success'

export interface ITextField {
  value: string
  maxLength: number
  disabled?: boolean
}

export interface ITextFieldProps extends ITextField {
  placeholder: string
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}
