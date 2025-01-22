import { useState } from 'react'
import { ITextField, TextFieldStatus } from './textFiled.types'

export default function useTextField({ value, maxLength = 200, disabled = false }: ITextField) {
  const [text, setText] = useState(value)
  const [status, setStatus] = useState<TextFieldStatus>(disabled ? 'disabled' : 'default')
  const [isFocused, setIsFocused] = useState(false)

  const handleStatusChange = (newValue: string) => {
    if (disabled) return

    if (newValue.length > maxLength) {
      return
    }
    setText(newValue)

    if (newValue.length === 0) {
      setStatus('default')
    } else {
      setStatus('typing')
    }
  }

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true)
      if (status !== 'error') {
        setStatus('input')
      }
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (!disabled && status !== 'error') {
      setStatus(text.length > 0 ? 'success' : 'default')
    }
  }

  return {
    text,
    status,
    isFocused,
    handleStatusChange,
    handleFocus,
    handleBlur,
  }
}
