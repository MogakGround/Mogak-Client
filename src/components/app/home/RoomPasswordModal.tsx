import IconInput from '@/components/global/input/IconInput'

import Modal, { ModalBackground } from '@/components/global/modal/Modal'
import { useState } from 'react'

import { IconInputArrow } from '@/components/global/input/input.types'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import Image from 'next/image'
import IconError from '@/assets/svg/toast-error.svg'
import { postEnterRoom } from '@/app/api/home/api'
import { ErrorResponse } from '@/app/api/api.types'
import { useRouter } from 'next/navigation'

export interface RoomPasswordModalProps {
  roomId: number
  isOpen: boolean
  handleCloseModal: () => void
}

export default function RoomPasswordModal({ roomId, isOpen, handleCloseModal }: RoomPasswordModalProps) {
  const [password, setPassword] = useState('')
  const [isMsgOpen, setIsMsgOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { push } = useRouter()

  const handleSubmitPwd = async () => {
    setIsLoading(true)
    try {
      await postEnterRoom(roomId, {
        password,
        isScreenShared: false,
        isVideoLargeAllowed: false,
      })
      sessionStorage.setItem('enteredRoom', String(roomId))
      push(`/mogak/${roomId}`)
    } catch (err) {
      if (err instanceof ErrorResponse && err.status === 401) {
        setIsMsgOpen(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        handleCloseModal={() => {
          handleCloseModal()
          setIsMsgOpen(false)
        }}
      >
        <h2 className="semi-20 mb-20">비밀번호가 걸린 모각방이에요</h2>
        <div className="flex flex-col gap-6 mb-40">
          <p>비밀번호</p>
          <IconInput
            isSecret
            iconArrow={IconInputArrow.right}
            size="small"
            name="password"
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-13">
          <BasicButton
            handleClick={handleCloseModal}
            variant={ButtonVariant.default}
            theme={ButtonTheme.text}
            size={ButtonSize.xxl}
            className="w-96"
            text="닫기"
          />

          <BasicButton
            handleClick={handleSubmitPwd}
            variant={ButtonVariant.filled}
            theme={ButtonTheme.primary}
            size={ButtonSize.xxl}
            className="w-259"
            disabled={isLoading}
            text="입력하기"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isMsgOpen}
        hasOverlay={false}
        WrapperClassName="!z-[100] top-[350px] left-0 right-0 bottom-0 py-12"
        className="py-12 px-16"
        backgroundColor={ModalBackground.gray800}
        handleCloseModal={() => setIsMsgOpen(false)}
      >
        <div className="flex gap-12 items-center">
          <Image src={IconError} alt="error" width={20} height={20} />
          <p className="med-14">틀린 비밀번호예요. 비밀번호를 다시 확인해주세요.</p>
        </div>
      </Modal>
    </div>
  )
}
