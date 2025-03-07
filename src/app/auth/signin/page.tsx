'use client'

import Image from 'next/image'
import LogoIcon from '@/assets/svg/logo.svg'
import ImageBackgroundLayout from '@/components/global/layout/ImageBackgroundLayout'
import KakaoButton from '@/components/global/button/KakaoButton'

export default function SignInPage() {
  const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
  const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`

  const handleSignUpClick = () => {
    window.location.href = kakaoAuthUrl
  }

  return (
    <ImageBackgroundLayout>
      <div className="relative z-1 flex flex-col items-center">
        <Image src={LogoIcon} alt="로고" width={156} height={79} />
        <div className="mt-[32px] mb-[52px]">
          <p className="semi-24 text-grayscale-50 whitespace-pre-line text-center">
            간단하게 가입하고{'\n'}작업을 시작해볼까요?
          </p>
        </div>
        <KakaoButton handleClick={handleSignUpClick} />
      </div>
    </ImageBackgroundLayout>
  )
}
