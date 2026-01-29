'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/components/global/modal/Modal'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import { postAuthDelete } from '@/app/api/auth/api'
import { useAuthStore } from '@/store/authStore'

interface LeaveModalProps {
  isOpen: boolean
  handleCloseModal: () => void
}

export default function LeaveModal({ isOpen, handleCloseModal }: LeaveModalProps) {
  const router = useRouter()
  const { clearTokens } = useAuthStore()
  const [isLeaving, setIsLeaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const leave = async () => {
    if (isLeaving) return
    setIsLeaving(true)
    setErrorMessage(null)

    try {
      await postAuthDelete()
      clearTokens()
      router.push('/auth/signin')
    } catch (error: unknown) {
      console.error(error)
      setErrorMessage('회원탈퇴에 실패했습니다. 다시 시도해주세요.')
      setIsLeaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} handleCloseModal={handleCloseModal} hasOverlay={false} closeOnOutsideClick={false}>
      <div className="mb-[40px]">
        <p className="semi-20 text-grayscale-50 mb-[8px]">정말 탈퇴하실건가요?</p>

        <div className="flex items-center">
          <p className="reg-14 text-grayscale-200 mb-[2px]">현재 만드신 모각방이 있으시다면 모각방이 삭제되고</p>
          <p className="reg-14 text-grayscale-200">작업 기록이 모두 사라져요. 그래도 탈퇴하실건가요?</p>
        </div>

        {errorMessage && <p className="reg-14 text-red-400 mt-[8px]">{errorMessage}</p>}

        <div className="flex mt-[40px]">
          <div className="w-[96px] mr-[13px]">
            <BasicButton
              theme={ButtonTheme.text}
              variant={ButtonVariant.default}
              size={ButtonSize.xxl}
              text="조금만 더 생각해볼게요"
              fullWidth={true}
              handleClick={handleCloseModal}
            />
          </div>
          <button type="submit" className="w-[259px]">
            <BasicButton
              theme={ButtonTheme.primary}
              variant={ButtonVariant.default}
              size={ButtonSize.xxl}
              text={isLeaving ? '탈퇴 중...' : '탈퇴하기'}
              fullWidth={true}
              handleClick={leave}
            />
          </button>
        </div>
      </div>
    </Modal>
  )
}
