import { ButtonSize, HeadcountIconTextButtonProps } from '@/components/global/button/button.types'
import { baseButton, buttonStyles, iconSizes, headcountButtonSizes } from '@/components/global/button/buttonStyle'
import userProfileIcon from '@/assets/svg/user-profile-white.svg'
import Image from 'next/image'

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
      className={`
        ${baseButton}
        ${headcountButtonSizes[size]}
        ${buttonStyles[theme][variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? '!bg-grayscale-600 !text-grayscale-400 cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      <Image src={userProfileIcon} alt="icon" width={iconSize} height={iconSize} />
      <p className="text-center ml-[1px]">
        <span className="med-14 text-white">{headcount}</span>
        <span
          className={`text-grayscale-400 ${size === ButtonSize.xs ? 'reg-12' : size === ButtonSize.sm ? 'reg-14' : 'reg-14'}`}
        >
          {' '}
          / {capacity}
        </span>
      </p>
    </button>
  )
}
