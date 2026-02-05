import { ButtonSize, HeadcountIconTextButtonProps } from '@/components/global/button/button.types'
import { baseButton, buttonStyles, iconSizes, headcountButtonSizes } from '@/components/global/button/buttonStyle'
import UserProfileIcon from '@/assets/svg/user-profile-white.svg'
import cn from '@/utils/cn'

export default function HeadcountIconTextButton({
  variant,
  theme,
  size,
  disabled,
  headcount,
  capacity,
  handleClick,
  fullWidth = false,
  type = 'button',
}: HeadcountIconTextButtonProps) {
  const iconSize = size && iconSizes[size]

  return (
    <button
      className={cn(
        baseButton,
        headcountButtonSizes[size],
        buttonStyles[theme][variant],
        fullWidth && 'w-full',
        disabled && '!bg-grayscale-600 !text-grayscale-400 cursor-not-allowed',
        'bg-grayscale-700'
      )}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      <UserProfileIcon width={iconSize} height={iconSize} />
      <p className="text-center ml-[1px] flex items-center">
        <span className="med-14 text-white">{headcount}</span>
        <span className="text-grayscale-400 mx-[2px]"> / </span>
        <span
          className={`text-grayscale-400 h-[19px] ${size === ButtonSize.xs ? 'reg-12' : size === ButtonSize.sm ? 'reg-14' : 'reg-14'}`}
        >
          {capacity}
        </span>
      </p>
    </button>
  )
}
