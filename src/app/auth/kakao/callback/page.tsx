'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { postAuthLogin } from '@/app/api/auth/api'
import { AxiosError } from 'axios'

export default function KakaoCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const kakaoCode = searchParams.get('code')

  useEffect(() => {
    const handleKakaoLogin = async () => {
      if (kakaoCode) {
        try {
          const res = await postAuthLogin({ kakaoCode })

          if (res.code === 200) {
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
            router.push('/')
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
              router.push(`/auth/signup?code=${kakaoCode}`)
            } else {
              console.error(error)
            }
          }
        }
      }
    }

    handleKakaoLogin()
  }, [kakaoCode, router])

  return <p>카카오 로그인 중...</p>
}
