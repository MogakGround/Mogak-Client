'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { postAuthLogin } from '@/app/api/auth/api'
import { useAuthStore } from '@/store/authStore'

export default function KakaoCallbackPage() {
  const { setAccessToken, setRefreshToken } = useAuthStore()

  const router = useRouter()
  const searchParams = useSearchParams()
  const kakaoCode = searchParams.get('code')

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

  return <p>카카오 로그인 중...</p>
}
