import { useState, useEffect } from 'react'
import { validateCommonText } from '@/utils/validate'
import { IRoomNewForm } from './useCreateRoom'

interface IUseCreateRoomStep3Props {
  roomNewForm: IRoomNewForm
  setRoomNewForm: (roomNewForm: IRoomNewForm) => void
}

export function useCreateRoomStep3({ roomNewForm, setRoomNewForm }: IUseCreateRoomStep3Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [passwordValidations, setPasswordValidations] = useState({ lengthValid: false, formatValid: false })
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false)
  const [isPrivate, setIsPrivate] = useState(roomNewForm.isPrivate)

  const handleClickComplete = () => {
    // TODO: 모각방 생성 API 호출
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
  }

  const handleToggle = () => {
    setIsPrivate((prev: boolean) => !prev)
    setRoomNewForm({
      ...roomNewForm,
      isPrivate: !roomNewForm.isPrivate,
      password: !roomNewForm.isPrivate ? '' : roomNewForm.password,
    })
  }

  useEffect(() => {
    setPasswordValidations(validateCommonText(roomNewForm.password))
  }, [roomNewForm.password])

  useEffect(() => {
    if (!selectedTag || !roomNewForm.isPrivate) {
      setIsNextButtonDisabled(true)
    } else if (selectedTag && roomNewForm.isPrivate) {
      if (roomNewForm.isPrivate && !passwordValidations.lengthValid && !passwordValidations.formatValid) {
        setIsNextButtonDisabled(true)
      } else {
        setIsNextButtonDisabled(false)
      }
    } else {
      setIsNextButtonDisabled(false)
    }
  }, [selectedTag, roomNewForm.isPrivate, passwordValidations])

  return {
    selectedTag,
    handleTagChange,
    isPrivate,
    handleToggle,
    handleClickComplete,
    passwordValidations,
    isNextButtonDisabled,
  }
}
