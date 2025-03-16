'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProfileIcon from '@/assets/svg/user-profile.svg'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'

export default function HeaderProfile() {
  const { accessToken } = useAuthStore()
  const { nickname } = useUserStore()

  return (
    <>
      {accessToken ? (
        <div
        className="mr-[80px] flex items-center gap-[8px] px-[12px] py-[8px] rounded-[4px] bg-grayscale-700"
        suppressHydrationWarning
      >
        <Image src={ProfileIcon} alt="프로필" width={16} height={16} />
        <span className="semi-14 text-grayscale-50">{nickname} 님</span>
      </div>
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