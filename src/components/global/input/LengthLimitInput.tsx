import { getLenthStyles } from '../textField/textFieldStyles'
import useInputStatus from './hooks/useInputStatus'
import { ILengthLimitInputProps } from './input.types'
import { getStatusStyles, inputSizes } from './inputStyles'

export default function LengthLimitInput({
  name,
  value,
  placeHolder,
  size,
  handleChange,
  disabled = false,
  maxLength,
  ...props
}: ILengthLimitInputProps) {
  const { isFocused, status, inputRef, handleInput, handleBlur } = useInputStatus({
    handleChange,
    disabled,
  })

  return (
    <div
      className={`w-full flex gap-2 rounded-lg border-[1.5px] py-[11px] px-[16px] reg-16
        ${isFocused ? 'border-accentT-30' : ''}
        ${getStatusStyles(status)}
        ${inputSizes[size]}
      `}
    >
      <input
        ref={inputRef}
        name={name || 'text'}
        className={`w-full h-full bg-transparent focus:outline-none`}
        value={value}
        placeholder={placeHolder || ''}
        onChange={handleInput}
        onBlur={handleBlur}
        disabled={disabled}
        maxLength={maxLength}
        {...props}
      />
      <div className="flex items-center justify-end reg-12">
        <span className={`mr-[2px] ${getLenthStyles(status)}`}>{value.length}</span>
        <span className={`${disabled ? 'text-grayscale-600' : 'text-grayscale-400'}`}>/{maxLength}</span>
      </div>
    </div>
  )
}
