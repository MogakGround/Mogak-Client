import { ChangeEvent } from 'react'

type InputType = 'text' | 'password'
export type InputStatus = 'default' | 'hover' | 'error' | 'disabled' | 'success' | 'typing'

export enum IconInputArrow {
  left = 'left',
  right = 'right',
}

export interface IBasicInputProps {
  size: 'small' | 'medium'
  type?: InputType
  name: string
  value: string
  placeHolder?: string
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  readonly?: boolean
}

export interface ILengthLimitInputProps extends IBasicInputProps {
  maxLength: number
}

export interface InputStatusHookProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

export interface IconInputProps extends IBasicInputProps {
  iconArrow: IconInputArrow
}
