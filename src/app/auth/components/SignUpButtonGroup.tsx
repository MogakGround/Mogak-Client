'use client'
import { useRouter } from 'next/navigation'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import { useEffect, useState } from 'react'

interface ISignUpButtonGroupProps {
  isNicknameChecked: boolean
  handleSignUpComplete: (kakaoId: string) => void
}

export default function SignUpButtonGroup({ isNicknameChecked, handleSignUpComplete }: ISignUpButtonGroupProps) {
  const router = useRouter()
  const [kakaoId, setKakaoId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setKakaoId(params.get('kakaoId'))
    }
  }, [])

  const handleSignInClick = () => {
    router.push('/auth/signin')
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
          handleClick={() => handleSignUpComplete(kakaoId ?? '')}
        />
      </div>
    </div>
  )
}
