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
      className={`rounded-lg border-[1.5px] outline-none
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
