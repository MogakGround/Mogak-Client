import { TextFieldStatus } from './textFiled.types'

export const getStatusStyles = (status: TextFieldStatus) => {
  switch (status) {
    case 'disabled':
      return 'reg-14 bg-grayscale-800 text-grayscale-600 placeholder-grayscale-600 border-none cursor-not-allowed'
    case 'default':
      return 'reg-14 bg-grayscale-800 text-grayscale-400 placeholder-grayscale-500 border-grayscale-700 focus:border-accentT-20'
    case 'hover':
      return 'reg-14 bg-grayscale-800 text-accentT-5 placeholder-grayscale-400 border-accentT-20'
    case 'error':
      return 'med-16 bg-primaryT-10 text-grayscale-50 border-primaryT-20'
    case 'typing':
      return 'med-16 bg-accentT-5 text-grayscale-50 border-accentT-20'
    default:
      return 'med-16 bg-grayscale-800 text-grayscale-50 border-grayscale-700 hover:border-accentT-20'
  }
}

export const getLenthStyles = (status: TextFieldStatus) => {
  switch (status) {
    case 'disabled':
    case 'default':
      return 'text-grayscale-600'
    case 'hover':
    case 'error':
    case 'typing':
      return 'text-grayscale-50'
    default:
      return 'text-grayscale-600'
  }
}
