import { useMutation } from '@tanstack/react-query'
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

  const { mutate: leave } = useMutation({
    mutationFn: postAuthDelete,
    onSuccess: () => {
      clearTokens()
      router.push('/auth/signin')
    },
  })

  return (
    <Modal isOpen={isOpen} handleCloseModal={handleCloseModal} hasOverlay={false} closeOnOutsideClick={false}>
      <div className="mb-[40px]">
        <p className="semi-20 text-grayscale-50 mb-[8px]">정말 탈퇴하실건가요?</p>

        <div className="flex items-center">
          <p className="reg-14 text-grayscale-200 mb-[2px]">현재 만드신 모각방이 있으시다면 모각방이 삭제되고</p>
          <p className="reg-14 text-grayscale-200">작업 기록이 모두 사라져요. 그래도 탈퇴하실건가요?</p>
        </div>

        {/* 모달 버튼 */}
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
              text="탈퇴하기"
              fullWidth={true}
              handleClick={() => leave()}
            />
          </button>
        </div>
      </div>
    </Modal>
  )
}
