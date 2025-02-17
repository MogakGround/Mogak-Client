import { IBasicButtonProps } from './button.types'
import { baseButton, buttonStyles, textButtonSizes } from '@/components/global/button/buttonStyle'

export default function BasicButton({
  variant,
  theme,
  size,
  disabled = false,
  text,
  handleClick,
  fullWidth = false,
  type = 'button',
}: IBasicButtonProps) {
  return (
    <button
      className={`
        ${baseButton}
        ${textButtonSizes[size]}
        ${buttonStyles[theme][variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? '!bg-grayscale-600 !text-grayscale-400 cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
