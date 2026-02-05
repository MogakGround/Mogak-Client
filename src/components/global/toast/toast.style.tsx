import { ToastTheme, ToastSize } from '@/components/global/toast/toast.types'

import XDarkIcon from '@/assets/svg/x-primary-dark.svg'
import XLightIcon from '@/assets/svg/x-primary-light.svg'

type ToastStyles = {
  [key in ToastTheme]: string
}

export const toastBaseStyle = 'items-center justify-center text-start px-3 py-4 rounded-[12px]'
export const iconToastBaseStyle =
  'flex w-full items-center text-start pl-[16px] pr-[20px] py-[12px] rounded-[12px] z-[100]'

export const toastBackgroundStyles: ToastStyles = {
  [ToastTheme.LIGHT]: 'bg-grayscale-700',
  [ToastTheme.DARK]: 'bg-grayscale-800',
}

export const toastTextStyles: ToastStyles = {
  [ToastTheme.LIGHT]: 'text-grayscale-50',
  [ToastTheme.DARK]: 'text-grayscale-50',
}

export const toastTextFont = (size: ToastSize, detailText?: string) => {
  switch (size) {
    case ToastSize.sm:
      return !detailText ? 'med-14' : 'med-16'
    case ToastSize.md:
      return !detailText ? 'med-16' : 'med-18'
  }
}

export const toastDetailTextFont = (size: ToastSize) => {
  switch (size) {
    case ToastSize.sm:
      return 'reg-12'
    case ToastSize.md:
      return 'reg-14'
  }
}

const toastXIconStyles = {
  [ToastTheme.LIGHT]: {
    [ToastSize.sm]: XLightIcon,
    [ToastSize.md]: XLightIcon,
  },
  [ToastTheme.DARK]: {
    [ToastSize.sm]: XDarkIcon,
    [ToastSize.md]: XDarkIcon,
  },
}

export const toastXIcon = (theme: ToastTheme, size: ToastSize) => {
  const IconComponent = toastXIconStyles[theme]?.[size]

  if (!IconComponent) {
    return null
  }

  return <IconComponent width={20} height={20} />
}
