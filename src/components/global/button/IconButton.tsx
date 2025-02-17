import { IButtonProps } from '@/components/global/button/button.types'
import {
  baseButton,
  buttonStyles,
  iconButtonSizes,
  iconColors,
  iconSizes,
} from '@/components/global/button/buttonStyle'
import { ARROW_ICON_SRC } from '@/constants/ArrowIcon'
import cn from '@/utils/cn'
import Image from 'next/image'

export default function IconButton({
  variant,
  theme,
  size,
  disabled,
  fullWidth = false,
  handleClick,
  type = 'button',
  iconSrc,
  className,
}: IButtonProps) {
  const iconColor = (!disabled ? iconColors[theme]?.[variant] : 'gray') as keyof typeof ARROW_ICON_SRC
  const iconSize = size && iconSizes[size]

  return (
    <button
      className={cn(
        baseButton,
        iconButtonSizes[size],
        buttonStyles[theme][variant],
        fullWidth && 'w-full',
        disabled && '!bg-grayscale-600 !text-grayscale-400 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      <Image src={iconSrc || ARROW_ICON_SRC[iconColor]} alt="icon" width={iconSize} height={iconSize} />
    </button>
  )
}
