import { stepMessages } from '@/constants/Room'
import { useCreateRoom } from './hooks/useCreateRoom'

import Modal from '@/components/global/modal/Modal'
import RoomNewStep1 from './CreateRoomStep1'
import RoomNewStep2 from './CreateRoomStep2'
import RoomNewStep3 from './CreateRoomStep3'
import AutoDisappearIconToast from '@/components/global/toast/AutoDisappearIconToast'
import { ToastTheme, ToastSize } from '@/components/global/toast/toast.types'
import useToast from '@/components/global/toast/hooks/useToast'

interface ICreateRoomModalProps {
  isOpen: boolean
  handleCloseModal: () => void
}

export default function CreateRoomModal({ isOpen, handleCloseModal }: ICreateRoomModalProps) {
  const { roomNewStatus, roomNewForm, setRoomNewForm, roomStatusChange, handleChangeForm } = useCreateRoom()
  const { isToastShow, toastMessage, handleShowIconToast, handleCloseToast, handleResetToast } = useToast()

  return (
    <Modal
      isOpen={isOpen}
      handleCloseModal={handleCloseModal}
      hasOverlay={false}
      closeOnOutsideClick={false}
      renderBottomFn={() => {
        return (
          <>
            {isToastShow && (
              <div className="w-[416px] mt-[16px] !text-grayscale-50 cursor-default">
                <AutoDisappearIconToast
                  duration={5000}
                  theme={ToastTheme.LIGHT}
                  size={ToastSize.sm}
                  text={toastMessage.text}
                  success={toastMessage.success}
                  handleClick={handleCloseToast}
                />
              </div>
            )}
          </>
        )
      }}
    >
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
          handleShowIconToast={handleShowIconToast}
          handleResetToast={handleResetToast}
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
