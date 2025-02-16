import { ChangeEvent } from 'react'

import { IRoomNewForm, RoomNewStatus } from './hooks/useCreateRoom'
import WorkTimeTag from './WorkTimeTag'
import RoomPrivacyToggle from './RoomPrivacyToggle'
import RoomNewButtonGroup from './CreateRoomBtnGroup'
import { useCreateRoomStep3 } from './hooks/useCreateRoomStep3'

interface IRoomNewStep3Props {
  roomNewForm: IRoomNewForm
  roomStatusChange: (status: RoomNewStatus) => void
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setRoomNewForm: (roomNewForm: IRoomNewForm) => void
}

export default function CreateRoomStep3({
  roomNewForm,
  roomStatusChange,
  handleChange,
  setRoomNewForm,
}: IRoomNewStep3Props) {
  const {
    selectedTag,
    passwordValidations,
    isNextButtonDisabled,
    isPrivate,
    handleTagChange,
    handleToggle,
    handleClickComplete,
  } = useCreateRoomStep3({ roomNewForm, setRoomNewForm })

  return (
    <>
      <WorkTimeTag selectedTag={selectedTag} handleTagChange={handleTagChange} />
      <RoomPrivacyToggle
        roomNewForm={roomNewForm}
        handleChange={handleChange}
        passwordValidations={passwordValidations}
        isPrivate={isPrivate}
        handleToggle={handleToggle}
      />
      <RoomNewButtonGroup
        previousStatus="step2"
        nextStatus="complete"
        roomStatusChange={roomStatusChange}
        handleClickComplete={handleClickComplete}
        nextButtonDisabled={isNextButtonDisabled}
      />
    </>
  )
}
