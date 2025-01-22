import { useState, useRef, ChangeEvent } from 'react'
import { InputStatusHookProps, InputStatus } from '../input.types'

export default function useInputStatus({ handleChange, disabled = false }: InputStatusHookProps) {
  const [status, setStatus] = useState<InputStatus>(disabled ? 'disabled' : 'default')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    handleChange(e)

    if (disabled) return

    if (inputValue.length === 0) {
      setStatus('default')
    } else if (inputValue.length > 0) {
      setStatus('typing')
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    setStatus(status !== 'disabled' ? 'success' : 'default')
  }

  return {
    isFocused,
    status,
    inputRef,
    handleInput,
    handleBlur,
  }
}
