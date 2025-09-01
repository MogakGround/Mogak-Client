import { ChangeEvent, useState } from 'react'
import { IRoomNewForm, RoomNewStatus } from './hooks/useCreateRoom'
import RoomNameInput from './RoomName'
import RoomDescription from './RoomDescription'
import RoomNewButtonGroup from './CreateRoomBtnGroup'
import { getCheckRoomName } from '@/app/api/room/api'

interface ICreateRoomStep1Props {
  handleShowIconToast: (text: string, success: boolean) => void
  roomNewForm: IRoomNewForm
  roomStatusChange: (status: RoomNewStatus) => void
  handleChangeForm: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setRoomNewForm: (roomNewForm: IRoomNewForm) => void
  handleResetToast: () => void
}

export default function CreateRoomStep1({
  roomNewForm,
  roomStatusChange,
  handleChangeForm,
  setRoomNewForm,
  handleShowIconToast,
  handleResetToast,
}: ICreateRoomStep1Props) {
  const [inputValidations, setInputValidations] = useState({ lengthValid: false, formatValid: false })
  const [isRoomNameChecked, setIsRoomNameChecked] = useState(false)

  const checkRoomNameAvailability = async () => {
    if (!roomNewForm.name.trim()) return
    handleResetToast()

    try {
      await getCheckRoomName({ roomName: roomNewForm.name })
      handleShowIconToast('와우 멋지네요! 사용할 수 있는 모각방 이름이에요', true)
      setIsRoomNameChecked(true)
    } catch (error) {
      if (error instanceof Error) {
        handleShowIconToast(error.message, false)
        setIsRoomNameChecked(false)
      }
    }
  }

  return (
    <>
      <RoomNameInput
        name="name"
        value={roomNewForm.name}
        handleChange={(e) => {
          handleChangeForm(e)
          setIsRoomNameChecked(false)
        }}
        checkRoomName={checkRoomNameAvailability}
        inputValidations={inputValidations}
        setInputValidations={setInputValidations}
        setRoomNewForm={setRoomNewForm}
      />
      <RoomDescription
        name="description"
        value={roomNewForm.description}
        handleChange={handleChangeForm}
        setRoomNewForm={setRoomNewForm}
      />
      <RoomNewButtonGroup
        previousStatus="initial"
        nextStatus="step2"
        roomStatusChange={roomStatusChange}
        nextButtonDisabled={!isRoomNameChecked}
      />
    </>
  )
}
