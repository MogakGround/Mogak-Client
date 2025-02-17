import { IBasicButtonProps } from './button.types'
import { baseButton, buttonStyles, buttonSizes } from '@/components/global/button/buttonStyle'
import { ButtonTheme } from './button.types'

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
        ${buttonSizes[size]}
        ${buttonStyles[theme][variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? (theme === ButtonTheme.text ? '!text-grayscale-400 cursor-not-allowed' : '!bg-grayscale-600 !text-grayscale-400 cursor-not-allowed') : ''}
      `}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
