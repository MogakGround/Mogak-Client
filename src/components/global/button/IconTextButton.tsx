import { IconTextButtonProps } from '@/components/global/button/button.types'
import { baseButton, textButtonSizes, buttonStyles, iconSizes } from '@/components/global/button/buttonStyle'
import Image from 'next/image'

export default function IconTextButton({
  variant,
  theme,
  size,
  disabled,
  text,
  handleClick,
  iconSrc,
  iconArrow,
  fullWidth = false,
  type = 'button',
}: IconTextButtonProps) {
  const iconSize = size && iconSizes[size]

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
      {iconArrow === 'left' && <Image src={iconSrc} alt="icon" width={iconSize} height={iconSize} />}
      {text}
      {iconArrow === 'right' && <Image src={iconSrc} alt="icon" width={iconSize} height={iconSize} />}
    </button>
  )
}
