'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { postAuthLogin } from '@/app/api/auth/api'
import { useAuthStore } from '@/store/authStore'
import LogoIcon from '@/assets/svg/logo.svg'
import ImageBackgroundLayout from '@/components/global/layout/ImageBackgroundLayout'

export default function KakaoCallbackPage() {
  const { setAccessToken, setRefreshToken } = useAuthStore()

  const router = useRouter()
  const [kakaoCode, setKakaoCode] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setKakaoCode(params.get('code'))
    }
  }, [])

  useEffect(() => {
    const handleKakaoLogin = async () => {
      if (kakaoCode) {
        try {
          const res = await postAuthLogin({ kakaoCode })

          if (res.data.status === 'success') {
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            router.push('/')
          } else {
            router.push(`/auth/signup?kakaoId=${res.data.kakaoId}`)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }

    handleKakaoLogin()
  }, [kakaoCode, router, setAccessToken, setRefreshToken])

  return (
    <ImageBackgroundLayout>
      <div className="relative z-1 flex flex-col items-center">
        <Image src={LogoIcon} alt="로고" width={156} height={79} className="mb-[32px]" />
        <h3 className="semi-24 text-grayscale-50 mb-[6px]">로그인 정보를 불러오고 있어요. </h3>
        <p className="reg-14 text-grayscale-400 mb-[40px]">평균 2~3초 정도 소요돼요. 잠시만 기다려주세요!</p>
        <Image src={'/images/spinner.gif'} alt="로딩" width={52} height={52} />
      </div>
    </ImageBackgroundLayout>
  )
}
