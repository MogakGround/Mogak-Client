import { RoomNewStatus } from './hooks/useCreateRoom'
import { ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import { ButtonSize } from '@/components/global/button/button.types'
import BasicButton from '@/components/global/button/BasicButton'

interface ICreateRoomBtnGroupProps {
  previousStatus: RoomNewStatus | 'initial'
  nextStatus: RoomNewStatus
  nextButtonDisabled?: boolean
  roomStatusChange: (status: RoomNewStatus) => void
  handleClickComplete?: () => void
}

export default function CreateRoomBtnGroup({
  previousStatus,
  nextStatus,
  nextButtonDisabled,
  roomStatusChange,
  handleClickComplete,
}: ICreateRoomBtnGroupProps) {
  const handleClickPrevious = () => {
    if (previousStatus === 'initial') {
      roomStatusChange('step1')
    } else {
      roomStatusChange(previousStatus)
    }
  }

  const handleClickNext = () => {
    if (nextStatus === 'complete' && handleClickComplete) {
      handleClickComplete()
    } else {
      roomStatusChange(nextStatus)
    }
  }

  return (
    <div className="flex items-center w-full mt-[40px]">
      <BasicButton
        size={ButtonSize.xxl}
        variant={ButtonVariant.default}
        theme={ButtonTheme.text}
        disabled={previousStatus === 'initial'}
        text="뒤로가기"
        handleClick={handleClickPrevious}
      />
      <div className="w-full flex-1">
        <BasicButton
          size={ButtonSize.xxl}
          variant={ButtonVariant.filled}
          theme={ButtonTheme.primary}
          disabled={nextButtonDisabled || false}
          fullWidth={true}
          text={nextStatus === 'complete' ? '만들기' : '다음'}
          handleClick={handleClickNext}
        />
      </div>
    </div>
  )
}
