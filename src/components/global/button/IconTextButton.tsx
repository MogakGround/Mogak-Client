import { IconTextButtonProps } from '@/components/global/button/button.types'
import {
  baseButton,
  textButtonSizes,
  buttonStyles,
  iconSizes,
  linkButtonSizes,
} from '@/components/global/button/buttonStyle'
import cn from '@/utils/cn'
import Image from 'next/image'

export default function IconTextButton({
  variant,
  theme,
  size,
  disabled,
  text,
  handleClick,
  iconSrc,
  iconWidth,
  iconArrow,
  fullWidth = false,
  type = 'button',
  link = false,
  children,
  className,
}: IconTextButtonProps) {
  const iconSize = iconWidth ? iconWidth : size && iconSizes[size]

  return (
    <button
      className={cn(
        baseButton,
        textButtonSizes[size],
        buttonStyles[theme][variant],
        fullWidth && 'w-full',
        disabled && '!bg-grayscale-600 !text-grayscale-400 cursor-not-allowed',
        link && linkButtonSizes[size],
        className
      )}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      {iconArrow === 'left' && <Image src={iconSrc} alt="icon" width={iconSize} height={iconSize} />}
      <div>{text ? text : children}</div>
      {iconArrow === 'right' && <Image src={iconSrc} alt="icon" width={iconSize} height={iconSize} />}
    </button>
  )
}
