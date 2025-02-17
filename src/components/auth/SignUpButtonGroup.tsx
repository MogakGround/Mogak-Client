import { useRouter } from 'next/navigation'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'

interface ISignUpButtonGroupProps {
  isNicknameChecked: boolean
  handleSignUpComplete: () => void
}

export default function SignUpButtonGroup({ isNicknameChecked, handleSignUpComplete }: ISignUpButtonGroupProps) {
  const router = useRouter()

  const handleSignInClick = () => {
    router.push('/auth/signup') // 페이지 이동
  }

  return (
    <div className="flex items-center w-full">
      <BasicButton
        size={ButtonSize.xxl}
        variant={ButtonVariant.default}
        theme={ButtonTheme.text}
        text="뒤로가기"
        handleClick={handleSignInClick}
      />
      <div className="w-full flex-1">
        <BasicButton
          size={ButtonSize.xxl}
          variant={ButtonVariant.filled}
          theme={ButtonTheme.primary}
          disabled={!isNicknameChecked}
          fullWidth={true}
          text="가입 완료하기"
          handleClick={handleSignUpComplete}
        />
      </div>
    </div>
  )
}
