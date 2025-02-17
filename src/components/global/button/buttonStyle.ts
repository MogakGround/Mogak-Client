import { ButtonTheme } from '@/components/global/button/button.types'

interface IButtonStyle {
  default: string
  filled?: string
}
type ButtonStyles = {
  [key in ButtonTheme]: IButtonStyle
}

export const baseButton = 'inline-flex items-center justify-center rounded-[40px] gap-[6px]'
export const buttonStyles: ButtonStyles = {
  [ButtonTheme.text]: {
    default: 'bg-transparent text-grayscale-50',
  },
  [ButtonTheme.white]: {
    default: 'text-grayscale-50 bg-grayscale-10',
    filled: 'text-grayscale-700 bg-grayscale-50',
  },
  [ButtonTheme.primary]: {
    default: 'text-primary-100 bg-primaryT-20',
    filled: 'text-white bg-primaryT-100',
  },
  [ButtonTheme.accent]: {
    default: 'text-accent-100 bg-accentT-10',
    filled: 'text-grayscale-700 bg-accent-100',
  },
}

export const textButtonSizes = {
  xxs: 'py-[4px] px-[12px] reg-12',
  xs: 'py-[4px] px-[12px] reg-12',
  sm: 'py-[6px] px-[14px] reg-12',
  md: 'py-[7px] px-[14px] semi-14',
  lg: 'py-[11px] px-[16px] semi-14',
  xl: 'py-[12px] px-[20px] semi-16',
  xxl: 'py-[14px] px-[20px] semi-16',
}
export const iconButtonSizes = {
  xxs: 'p-[6px]',
  xs: 'p-[6px]',
  sm: 'p-[8px]',
  md: 'p-[10px]',
  lg: 'p-[12px]',
  xl: 'p-[12px]',
  xxl: 'p-[14px]',
}
export const headcountButtonSizes = {
  xxs: '',
  xs: 'py-[4px] px-[8px]',
  sm: 'py-[6px] px-[14px]',
  md: '',
  lg: '',
  xl: '',
  xxl: '',
}
export const iconSizes = {
  xxs: 16,
  xs: 16,
  sm: 16,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 24,
} as const

export const iconColors: ButtonStyles = {
  [ButtonTheme.text]: {
    default: 'white',
  },
  [ButtonTheme.white]: {
    default: 'white',
    filled: 'navy',
  },
  [ButtonTheme.primary]: {
    default: 'red',
    filled: 'white',
  },
  [ButtonTheme.accent]: {
    default: 'sky',
    filled: 'navy',
  },
}
