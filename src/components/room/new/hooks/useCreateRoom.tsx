import { ChangeEvent, useState } from 'react'
import { THUMBNAIL_LIST } from '@/constants/Room'

export interface IRoomNewFormProps {
  value: string
  name: string
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setRoomNewForm: (roomNewForm: IRoomNewForm) => void
}

export type RoomNewStatus = 'step1' | 'step2' | 'step3' | 'complete'
export interface IRoomNewForm {
  name: string
  description: string
  thumbnail: string
  time: string[]
  isPrivate: boolean
  password: string
}

export function useCreateRoom() {
  const [roomNewStatus, setRoomNewStatus] = useState<RoomNewStatus>('step1')
  const [roomNewForm, setRoomNewForm] = useState<IRoomNewForm>({
    name: '',
    description: '',
    thumbnail: THUMBNAIL_LIST[0].id,
    time: [],
    isPrivate: false,
    password: '',
  })

  const handleChangeForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRoomNewForm({ ...roomNewForm, [name]: value })
  }

  const roomStatusChange = (status: RoomNewStatus) => {
    setRoomNewStatus(status)
  }

  const showToastMessage = (message: string) => {
    alert(message)
  }

  return {
    roomNewStatus,
    roomNewForm,
    setRoomNewForm,
    roomStatusChange,
    handleChangeForm,
    showToastMessage,
  }
}
