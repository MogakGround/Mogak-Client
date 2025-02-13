import { IBasicInputProps } from './input.types'
import { getStatusStyles, inputSizes } from './inputStyles'
import useInputStatus from './hooks/useInputStatus'

export default function BasicInput({
  name,
  value,
  placeHolder,
  size,
  handleChange,
  disabled = false,
  ...props
}: IBasicInputProps) {
  const { status, inputRef, handleInput, handleBlur } = useInputStatus({
    handleChange,
    disabled,
  })

  return (
    <input
      ref={inputRef}
      name={name || 'text'}
      className={`w-full rounded-lg border-[1.5px] outline-none py-[11px] px-[16px] reg-16
        ${inputSizes[size]}
        ${getStatusStyles(status)}
      `}
      value={value}
      placeholder={placeHolder || ''}
      onChange={handleInput}
      onBlur={handleBlur}
      disabled={disabled}
      {...props}
    />
  )
}
