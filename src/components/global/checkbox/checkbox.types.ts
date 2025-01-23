export enum CheckboxColor {
  white = 'white',
  primary = 'primary',
  accent = 'accent',
}

export interface ICheckboxProps {
  id: string
  text?: string
  size?: 'small' | 'medium' | 'large'
  isChecked: boolean
  color: CheckboxColor
  isDisabled?: boolean
  handleChange: () => void
}
