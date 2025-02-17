'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LogoIcon from '@/assets/svg/logo.svg'
import KakaoButton from '@/components/global/button/KakaoButton'
import AuthLayout from '@/components/auth/AuthLayout'

export default function SignInPage() {
  const router = useRouter()

  const handleSignUpClick = () => {
    router.push('/auth/signup') // 페이지 이동
  }

  return (
    <AuthLayout>
      <div className="relative z-1 flex flex-col items-center">
        <Image src={LogoIcon} alt="로고" width={156} height={79} />
        <div className="mt-[32px] mb-[52px]">
          <p className="semi-24 text-grayscale-50 whitespace-pre-line text-center">
            간단하게 가입하고{'\n'}작업을 시작해볼까요?
          </p>
        </div>
        <KakaoButton handleClick={handleSignUpClick} />
      </div>
    </AuthLayout>
  )
}
