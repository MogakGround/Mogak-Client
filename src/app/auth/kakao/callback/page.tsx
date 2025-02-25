'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { postAuthLogin } from '@/app/api/auth/api'

export default function KakaoCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const kakaoCode = searchParams.get('code')

  useEffect(() => {
    const handleKakaoLogin = async () => {
      if (kakaoCode) {
        try {
          const res = await postAuthLogin({ kakaoCode })

          if (res.data.status === 'success') {
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
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
  }, [kakaoCode, router])

  return <p>카카오 로그인 중...</p>
}
