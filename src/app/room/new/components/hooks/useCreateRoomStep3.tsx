import { useState, useEffect } from 'react'
import { validateCommonText } from '@/utils/validate'
import { IRoomNewForm } from './useCreateRoom'
import { WorkHours, PostCreateRoomRequest } from '@/app/api/room/room.types'
import { postCreateRoom } from '@/app/api/room/api'
import { useRouter } from 'next/navigation'

interface IUseCreateRoomStep3Props {
  roomNewForm: IRoomNewForm
  setRoomNewForm: (roomNewForm: IRoomNewForm) => void
}

export function useCreateRoomStep3({ roomNewForm, setRoomNewForm }: IUseCreateRoomStep3Props) {
  const [passwordValidations, setPasswordValidations] = useState({ lengthValid: false, formatValid: false })
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false)
  const { push } = useRouter()

  const handleClickComplete = async () => {
    try {
      const body: PostCreateRoomRequest = {
        roomName: roomNewForm.name,
        roomImg: roomNewForm.thumbnail,
        workHours: roomNewForm.time,
        isLocked: roomNewForm.isLocked,
        ...(roomNewForm.isLocked && { roomPassword: roomNewForm.password }),
        ...(roomNewForm.description && { roomExplain: roomNewForm.description }),
      }
      const { roomId } = await postCreateRoom(body)
      push(`/mogak/${roomId}`)
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  const handleTagChange = (tag: WorkHours) => {
    setRoomNewForm({
      ...roomNewForm,
      time: roomNewForm.time.includes(tag)
        ? roomNewForm.time.filter((t) => t !== tag)
        : [...new Set([...roomNewForm.time, tag])],
    })
  }

  const handleToggle = () => {
    const isLocked = !roomNewForm.isLocked
    setRoomNewForm({ ...roomNewForm, password: '', isLocked })
    setPasswordValidations(
      isLocked ? { lengthValid: false, formatValid: false } : { lengthValid: true, formatValid: true }
    )
  }

  useEffect(() => {
    if (roomNewForm.isLocked) {
      setPasswordValidations(validateCommonText(roomNewForm.password))
    }
  }, [roomNewForm.password, roomNewForm.isLocked])

  useEffect(() => {
    setIsNextButtonDisabled(
      roomNewForm.time.length === 0 ||
        (roomNewForm.isLocked && (!passwordValidations.lengthValid || !passwordValidations.formatValid))
    )
  }, [roomNewForm.time, roomNewForm.isLocked, passwordValidations])

  return {
    handleTagChange,
    handleToggle,
    handleClickComplete,
    passwordValidations,
    isNextButtonDisabled,
  }
}
