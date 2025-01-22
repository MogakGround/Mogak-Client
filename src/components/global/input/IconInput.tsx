import Image from 'next/image'
import useInputStatus from './hooks/useInputStatus'
import { IconInputProps } from './input.types'
import { getStatusStyles, inputSizes } from './inputStyles'
import Search from '@/assets/svg/search.svg'
import SearchDisabled from '@/assets/svg/search-disabled.svg'

export default function IconInput({
  name,
  value,
  placeHolder,
  size,
  handleChange,
  disabled = false,
  iconArrow,
  ...props
}: IconInputProps) {
  const { isFocused, status, inputRef, handleInput, handleBlur } = useInputStatus({
    handleChange,
    disabled,
  })

  return (
    <div
      className={`w-full flex items-center gap-2 rounded-lg border-[1.5px] px-4 py-3
        ${isFocused ? 'border-accentT-30' : ''}
        ${getStatusStyles(status)}
        ${inputSizes[size]}
      `}
    >
      <span>
        {iconArrow === 'left' && <Image src={!disabled ? Search : SearchDisabled} alt="icon" width={24} height={24} />}
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
        {...props}
      />
      <span>
        {iconArrow === 'right' && <Image src={!disabled ? Search : SearchDisabled} alt="icon" width={24} height={24} />}
      </span>
    </div>
  )
}
