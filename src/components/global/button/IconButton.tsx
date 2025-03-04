import cn from '@/utils/cn'
import { IconButtonProps } from '@/components/global/button/button.types'
import { baseButton, buttonStyles, iconButtonSizes, iconSizes } from '@/components/global/button/buttonStyle'
import Image from 'next/image'

export default function IconButton({
  variant,
  theme,
  size,
  disabled,
  fullWidth = false,
  iconSrc,
  handleClick,
  type = 'button',
  className,
}: IconButtonProps) {
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
      <Image src={iconSrc} alt="icon" width={iconSize} height={iconSize} />
    </button>
  )
}
