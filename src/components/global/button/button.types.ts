export enum ButtonVariant {
  default = 'default',
  filled = 'filled',
}
export enum ButtonTheme {
  text = 'text',
  primary = 'primary',
  accent = 'accent',
  white = 'white',
}
export enum ButtonSize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}
export enum IconArrow {
  left = 'left',
  right = 'right',
}

export interface IButtonProps {
  variant: ButtonVariant
  theme: ButtonTheme
  size: ButtonSize
  disabled?: boolean
  handleClick: () => void
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  iconSrc?: string
  className?: string
}

export interface IBasicButtonProps extends IButtonProps {
  text?: string
  children?: React.ReactNode
}
export interface ArrowIconTextButtonProps extends IBasicButtonProps {
  iconArrow: IconArrow
  iconSrc?: string
  iconWidth?: number
}

export interface IRoundedSquareButtonProps {
  text: string
  handleClick: () => void
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}
export interface IconTextButtonProps extends IBasicButtonProps {
  iconSrc: string
  iconArrow: IconArrow
  link?: boolean
}
export interface IconButtonProps extends IButtonProps {
  iconSrc: string
}
export interface HeadcountIconTextButtonProps extends IButtonProps {
  headcount: number
  capacity: number
}
