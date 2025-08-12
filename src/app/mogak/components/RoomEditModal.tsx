import { useState } from 'react'
import Modal from '@/components/global/modal/Modal'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import BasicInput from '@/components/global/input/BasicInput'
import TextToggle from '@/components/global/toggle/TextToggle'
import { ToggleTheme } from '@/components/global/toggle/toggle.types'
import ValidationCheck from '@/components/global/form/vaildationCheck'
import RoundedSquareButton from '@/components/global/button/RoundedSquareButton'
import { useRoomNameCheck } from '@/hooks/useRoomNameCheck'
import useToast from '@/components/global/toast/hooks/useToast'
import AutoDisappearIconToast from '@/components/global/toast/AutoDisappearIconToast'
import { ToastSize, ToastTheme } from '@/components/global/toast/toast.types'
import { patchRoomInfo } from '@/app/api/room/api'

export interface RoomEditModalProps {
  roomId: string
  isOpen: boolean
  handleCloseModal: () => void
  currentRoomName?: string
  currentIsPublic?: boolean
}

export default function RoomEditModal({
  roomId,
  isOpen,
  handleCloseModal,
  currentRoomName = '',
  currentIsPublic = true,
}: RoomEditModalProps) {
  const [roomName, setRoomName] = useState(currentRoomName)
  const [isPublic, setIsPublic] = useState(currentIsPublic)

  const { isRoomNameChecked, isLoading, checkRoomNameAvailability, resetRoomNameCheck } = useRoomNameCheck()
  const { isToastShow, toastMessage, handleShowIconToast, handleCloseToast, handleResetToast } = useToast()

  const handleCloseModalWithReset = () => {
    handleResetToast()
    resetRoomNameCheck()
    handleCloseModal()
  }

  const handleDuplicateCheck = async () => {
    if (!roomName.trim()) return

    try {
      await checkRoomNameAvailability(roomName)
      handleShowIconToast('와우 멋지네요! 사용할 수 있는 모각방 이름이에요', true)
    } catch (error) {
      handleShowIconToast('다시 시도해주세요', false)
      console.error('중복 확인 실패:', error)
    }
  }

  const handleSubmit = async () => {
    if (!roomName.trim() || !isRoomNameChecked) return

    try {
      await patchRoomInfo(roomId, { roomName, isLocked: !isPublic, roomPassword: '' })
      handleCloseModal()
    } catch (error) {
      console.error('모각방 정보 수정 실패:', error)
    }
  }

  const isLengthValid = roomName.length <= 16 && roomName.length > 0
  const isCharacterValid = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]*$/.test(roomName)
  const isValidationPassed = isLengthValid && isCharacterValid

  const isFormValid = roomName.trim() && isRoomNameChecked

  return (
    <Modal
      isOpen={isOpen}
      handleCloseModal={handleCloseModalWithReset}
      renderBottomFn={() => {
        return (
          <>
            {isToastShow && (
              <div className="w-[480px] mt-[16px] !text-grayscale-50 cursor-default">
                <AutoDisappearIconToast
                  key={toastMessage.text}
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
      className="w-[480px] p-24"
    >
      <h2 className="semi-20 text-white mb-[32px]">모각방 정보 수정하기</h2>
      <div className="mb-[32px]">
        <label className="semi-16 mb-[6px] block">모각방 이름</label>
        <div className="flex gap-12 mb-16">
          <div className="flex-1">
            <BasicInput
              value={roomName}
              handleChange={(e) => {
                setRoomName(e.target.value)
                resetRoomNameCheck()
              }}
              placeHolder="모각방방"
              size="medium"
              name="roomName"
            />
          </div>
          <RoundedSquareButton
            text="중복 확인"
            handleClick={handleDuplicateCheck}
            disabled={!roomName.trim() || isLoading || !isValidationPassed}
          />
        </div>

        <div className="flex gap-[16px]">
          <ValidationCheck isValid={isLengthValid} text="공백 포함 16자 이내" />
          <ValidationCheck isValid={isCharacterValid} text="한글, 영어로만 구성" />
        </div>
      </div>

      <div className="flex justify-between mb-[40px]">
        <label className="block text-white semi-16 mb-12">모각방 공개 여부</label>
        <TextToggle
          theme={ToggleTheme.DARK}
          isOn={isPublic}
          onToggle={() => setIsPublic(!isPublic)}
          textl="공개"
          textr="비공개"
        />
      </div>

      <div className="flex gap-[13px]">
        <BasicButton
          handleClick={handleCloseModalWithReset}
          variant={ButtonVariant.default}
          theme={ButtonTheme.text}
          size={ButtonSize.xxl}
          className="w-[96px]"
          text="닫기"
        />
        <BasicButton
          handleClick={handleSubmit}
          variant={ButtonVariant.filled}
          theme={ButtonTheme.primary}
          size={ButtonSize.xxl}
          className="flex-1"
          disabled={!isFormValid}
          text="수정 완료하기"
        />
      </div>
    </Modal>
  )
}
