import { CheckboxColor } from './checkbox.types'

import CheckDefault from '@/assets/svg/check-default.svg'
import CheckWhite from '@/assets/svg/check-white.svg'
import CheckPrimary from '@/assets/svg/check-primary.svg'
import CheckAccent from '@/assets/svg/check-accent.svg'

export const getCheckboxSrc = (color: string, isChecked: boolean): string => {
  if (!isChecked) {
    return CheckDefault
  }

  switch (color) {
    case CheckboxColor.white:
      return CheckWhite
    case CheckboxColor.primary:
      return CheckPrimary
    case CheckboxColor.accent:
      return CheckAccent
    default:
      return CheckDefault
  }
}
export const checkboxSize = {
  small: 'w-[20px] h-[20px]',
  medium: 'w-[24px] h-[24px]',
  large: 'w-[28px] h-[28px]',
}

export const checkboxBgColor = {
  default: 'rounded-full border border-grayscale-600 bg-grayscale-700',
  white: 'rounded-full bg-grayscale-600',
  primary: 'rounded-full bg-primary bg-primaryT-20',
  accent: 'rounded-full bg-accent bg-accentT-20',
}
