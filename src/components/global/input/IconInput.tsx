import useInputStatus from './hooks/useInputStatus'
import { IconInputProps } from './input.types'
import { getStatusStyles, inputSizes } from './inputStyles'
import Search from '@/assets/svg/search.svg'
import SearchDisabled from '@/assets/svg/search-disabled.svg'
import Eye from '@/assets/svg/eye.svg'
import IcEyes from '@/assets/svg/ic_eyes.svg'
import cn from '@/utils/cn'
import { useState } from 'react'

export default function IconInput({
  name,
  value,
  placeHolder,
  size,
  handleChange,
  disabled = false,
  iconArrow,
  iconSrc,
  isSecret,
  ...props
}: IconInputProps) {
  const { isFocused, status, inputRef, handleInput, handleBlur } = useInputStatus({
    handleChange,
    disabled,
  })
  const [showPassword, setShowPassword] = useState(false)

  const Icon =
    iconSrc || (isSecret && showPassword)
      ? IcEyes
      : isSecret && !showPassword
        ? Eye
        : !disabled
          ? Search
          : SearchDisabled

  return (
    <div
      className={cn(
        'w-full flex items-center gap-[8px] rounded-lg border-[1.5px] py-[11px] reg-16',
        isFocused && 'border-accentT-30',
        iconArrow === 'left' ? 'pl-[16px] pr-[12px]' : 'p1-[12px] pr-[16px]',
        getStatusStyles(status),
        inputSizes[size]
      )}
    >
      <span className="flex items-center justify-center">
        {iconArrow === 'left' && <Icon width={24} height={24} />}
      </span>
      <input
        ref={inputRef}
        name={name || 'text'}
        className={`w-full h-full bg-transparent focus:outline-none`}
        value={value}
        placeholder={placeHolder || ''}
        onChange={handleInput}
        onBlur={handleBlur}
        disabled={disabled}
        type={isSecret ? (showPassword ? 'text' : 'password') : props.type || 'text'}
        {...props}
      />

      <span className="flex items-center justify-center">
        {iconArrow === 'right' &&
          (isSecret ? (
            <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
              <Icon width={24} height={24} />
            </button>
          ) : (
            (() => {
              const RightIcon = iconSrc || (!disabled ? Search : SearchDisabled)
              return <RightIcon width={24} height={24} />
            })()
          ))}
      </span>
    </div>
  )
}
