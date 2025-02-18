import { IconTextButtonProps } from '@/components/global/button/button.types'
import { baseButton, buttonSizes, buttonStyles, iconColors, iconSizes } from '@/components/global/button/buttonStyle'
import { ARROW_ICON_SRC } from '@/constants/ArrowIcon'
import cn from '@/utils/cn'
import Image from 'next/image'

export default function IconTextButton({
  variant,
  theme,
  size,
  disabled,
  text,
  handleClick,
  iconArrow,
  iconSrc,
  iconWidth,
  fullWidth = false,
  type = 'button',
  children,
  className,
}: IconTextButtonProps) {
  const iconColor = (!disabled ? iconColors[theme]?.[variant] : 'gray') as keyof typeof ARROW_ICON_SRC
  const iconSize = iconWidth ? iconWidth : size && iconSizes[size]

  return (
    <button
      className={cn(
        baseButton,
        buttonSizes[size],
        buttonStyles[theme][variant],
        fullWidth && 'w-full',
        disabled && '!bg-grayscale-600 !text-grayscale-400 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      {iconArrow === 'left' && (
        <Image src={iconSrc || ARROW_ICON_SRC[iconColor]} alt="icon" width={iconSize} height={iconSize} />
      )}
      <div>{text ? text : children}</div>
      {iconArrow === 'right' && (
        <Image src={iconSrc || ARROW_ICON_SRC[iconColor]} alt="icon" width={iconSize} height={iconSize} />
      )}
    </button>
  )
}
