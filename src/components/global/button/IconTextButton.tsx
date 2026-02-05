import { IconTextButtonProps } from '@/components/global/button/button.types'
import {
  baseButton,
  textButtonSizes,
  buttonStyles,
  iconSizes,
  linkButtonSizes,
} from '@/components/global/button/buttonStyle'
import cn from '@/utils/cn'

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
  const IconComponent = iconSrc

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
      {iconArrow === 'left' && <IconComponent width={iconSize} height={iconSize} />}
      <div>{text ? text : children}</div>
      {iconArrow === 'right' && <IconComponent width={iconSize} height={iconSize} />}
    </button>
  )
}
