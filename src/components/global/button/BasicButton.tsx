import { IBasicButtonProps } from './button.types'
import { baseButton, buttonStyles, buttonSizes } from '@/components/global/button/buttonStyle'

export default function BasicButton({
  variant,
  theme,
  size,
  disabled = false,
  text,
  handleClick,
  type = 'button',
}: IBasicButtonProps) {
  return (
    <button
      className={`
        ${baseButton}
        ${buttonSizes[size]}
        ${buttonStyles[theme][variant]}
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
