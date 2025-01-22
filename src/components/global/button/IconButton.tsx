import { IButtonProps } from '@/components/global/button/button.types'
import { baseButton, buttonStyles, iconButtonSizes, iconColors, iconSizes } from '@/components/global/button/buttonStyle'
import { ARROW_ICON_SRC } from '@/constants/ArrowIcon'
import Image from 'next/image'

export default function IconButton({ variant, theme, size, disabled, handleClick, type = 'button' }: IButtonProps) {
  const iconColor = (!disabled ? iconColors[theme]?.[variant] : 'gray') as keyof typeof ARROW_ICON_SRC
  const iconSize = size && iconSizes[size]

  return (
    <button
      className={`
        ${baseButton}
        ${iconButtonSizes[size]}
        ${buttonStyles[theme][variant]}
        ${disabled ? '!bg-grayscale-600 !text-grayscale-400 cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      <Image src={ARROW_ICON_SRC[iconColor]} alt="icon" width={iconSize} height={iconSize} />
    </button>
  )
}
