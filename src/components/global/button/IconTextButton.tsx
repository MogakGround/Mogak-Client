import { IconTextButtonProps } from '@/components/global/button/button.types'
import { baseButton, buttonSizes, buttonStyles, iconColors, iconSizes } from '@/components/global/button/buttonStyle'
import { ARROW_ICON_SRC } from '@/constants/ArrowIcon'
import Image from 'next/image'

export default function IconTextButton({
  variant,
  theme,
  size,
  disabled,
  text,
  handleClick,
  iconArrow,
  type = 'button',
}: IconTextButtonProps) {
  const iconColor = (!disabled ? iconColors[theme]?.[variant] : 'gray') as keyof typeof ARROW_ICON_SRC
  const iconSize = size && iconSizes[size]

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
      {iconArrow === 'left' && <Image src={ARROW_ICON_SRC[iconColor]} alt="icon" width={iconSize} height={iconSize} />}
      {text}
      {iconArrow === 'right' && <Image src={ARROW_ICON_SRC[iconColor]} alt="icon" width={iconSize} height={iconSize} />}
    </button>
  )
}
