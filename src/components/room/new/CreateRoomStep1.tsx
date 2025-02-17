import { ChangeEvent, useState } from 'react'
import { IRoomNewForm, RoomNewStatus } from './hooks/useCreateRoom'
import RoomNameInput from './RoomName'
import RoomDescription from './RoomDescription'
import RoomNewButtonGroup from './CreateRoomBtnGroup'

interface ICreateRoomStep1Props {
  showToastMessage: (message: string) => void
  roomNewForm: IRoomNewForm
  roomStatusChange: (status: RoomNewStatus) => void
  handleChangeForm: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setRoomNewForm: (roomNewForm: IRoomNewForm) => void
}

export default function CreateRoomStep1({
  roomNewForm,
  roomStatusChange,
  handleChangeForm,
  setRoomNewForm,
  showToastMessage,
}: ICreateRoomStep1Props) {
  const [inputValidations, setInputValidations] = useState({ lengthValid: false, formatValid: false })

  const checkRoomNameAvailability = async () => {
    if (!roomNewForm.name.trim()) return
    const isAvailable = true // TODO: 실제 API 요청

    if (isAvailable) {
      showToastMessage('와우 멋지네요! 사용할 수 있는 모각방 이름이에요')
    }
  }

  return (
    <>
      <RoomNameInput
        name="name"
        value={roomNewForm.name}
        handleChange={handleChangeForm}
        checkRoomName={checkRoomNameAvailability}
        inputValidations={inputValidations}
        setInputValidations={setInputValidations}
        setRoomNewForm={setRoomNewForm}
      />
      <RoomDescription
        name="roomDescription"
        value={roomNewForm.description}
        handleChange={handleChangeForm}
        setRoomNewForm={setRoomNewForm}
      />
      <RoomNewButtonGroup
        previousStatus="initial"
        nextStatus="step2"
        roomStatusChange={roomStatusChange}
        nextButtonDisabled={!inputValidations.lengthValid || !inputValidations.formatValid}
      />
    </>
  )
}
