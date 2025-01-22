import React, { ChangeEvent } from 'react'
import { getLenthStyles, getStatusStyles } from './textFieldStyles'
import { ITextFieldProps } from './textFiled.types'
import useTextField from './useTextField'

export default function TextField({ placeholder, value, disabled = false, maxLength, handleChange }: ITextFieldProps) {
  const { text, status, isFocused, handleStatusChange, handleFocus, handleBlur } = useTextField({
    value,
    maxLength,
    disabled,
  })

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value: newValue } = e.target
    handleStatusChange(newValue)
    handleChange(e)
  }

  return (
    <div
      className={`w-full flex flex-col gap-2 rounded-lg border-[1.5px] px-4 py-3
      ${isFocused ? 'border-accentT-30' : ''}
      ${getStatusStyles(status)}`}
    >
      <textarea
        value={text}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full h-full bg-transparent focus:outline-none resize-none"
        disabled={disabled}
      />
      <div className="flex justify-end reg-12">
        <span className={`mr-[2px] ${getLenthStyles(status)}`}>{text.length}</span>
        <span className={`${disabled ? 'text-grayscale-600' : 'text-grayscale-400'}`}>/{maxLength}</span>
      </div>
    </div>
  )
}
