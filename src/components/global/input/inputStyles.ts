import { InputStatus } from './input.types'

export const inputSizes = {
  small: 'h-[48px]',
  medium: 'h-[54px]',
}

export const getStatusStyles = (status: InputStatus) => {
  switch (status) {
    case 'disabled':
      return 'bg-grayscale-800 text-grayscale-600 placeholder-grayscale-600 border-none cursor-not-allowed'
    case 'default':
      return 'bg-grayscale-800 text-grayscale-500 placeholder-grayscale-500 border-grayscale-700 focus:border-accentT-20'
    case 'hover':
      return 'bg-grayscale-800 text-accentT-5 placeholder-grayscale-400 border-accentT-20'
    case 'error':
      return 'bg-primaryT-5 text-grayscale-50 border-primaryT-20'
    case 'typing':
      return 'bg-accentT-5 text-grayscale-50 border-accentT-20'
    default:
      return 'bg-grayscale-800 text-grayscale-50 border-grayscale-700 hover:border-accentT-20'
  }
}
