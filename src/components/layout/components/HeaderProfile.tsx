'use client'

import Link from 'next/link'
import ProfileIcon from '@/assets/svg/user-profile.svg'
import { useUserStore } from '@/store/userStore'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export default function HeaderProfile() {
  const { accessToken } = useAuthStore()
  const { nickname, fetchUser } = useUserStore()

  useEffect(() => {
    if (accessToken && !nickname) {
      fetchUser()
    }
  }, [accessToken, fetchUser, nickname])

  return (
    <>
      {nickname ? (
        <Link href="/mypage">
          <div
            className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[4px] bg-grayscale-700 w-fit"
            suppressHydrationWarning
          >
            <ProfileIcon width={16} height={16} />
            <span className="semi-14 text-grayscale-50">{nickname} 님</span>
          </div>
        </Link>
      ) : (
        <Link href="/auth/signin">
          <div
            className="mr-[80px] rounded-[40px] bg-grayscale-50 text-grayscale-700 semi-14 px-[14px] py-[7px] cursor-pointer"
            suppressHydrationWarning
          >
            로그인
          </div>
        </Link>
      )}
    </>
  )
}
