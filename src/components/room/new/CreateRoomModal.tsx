import { stepMessages } from '@/constants/Room'
import { useCreateRoom } from './hooks/useCreateRoom'

import Modal from '@/components/global/modal/Modal'
import RoomNewStep1 from './CreateRoomStep1'
import RoomNewStep2 from './CreateRoomStep2'
import RoomNewStep3 from './CreateRoomStep3'

interface ICreateRoomModalProps {
  isOpen: boolean
  handleCloseModal: () => void
}

export default function CreateRoomModal({ isOpen, handleCloseModal }: ICreateRoomModalProps) {
  const { roomNewStatus, roomNewForm, setRoomNewForm, roomStatusChange, handleChangeForm, showToastMessage } =
    useCreateRoom()

  return (
    <Modal isOpen={isOpen} handleCloseModal={handleCloseModal} hasOverlay={false} closeOnOutsideClick={false}>
      <div className="mb-[40px]">
        <h2 className="semi-20 text-grayscale-50 mb-[2px]">모각방 만들기</h2>
        <p className="reg-14 text-grayscale-400">{stepMessages[roomNewStatus]}</p>
      </div>
      {roomNewStatus === 'step1' && (
        <RoomNewStep1
          roomNewForm={roomNewForm}
          roomStatusChange={roomStatusChange}
          handleChangeForm={handleChangeForm}
          setRoomNewForm={setRoomNewForm}
          showToastMessage={showToastMessage}
        />
      )}
      {roomNewStatus === 'step2' && (
        <RoomNewStep2 roomNewForm={roomNewForm} setRoomNewForm={setRoomNewForm} roomStatusChange={roomStatusChange} />
      )}
      {roomNewStatus === 'step3' && (
        <RoomNewStep3
          roomNewForm={roomNewForm}
          setRoomNewForm={setRoomNewForm}
          roomStatusChange={roomStatusChange}
          handleChange={handleChangeForm}
        />
      )}
    </Modal>
  )
}
