'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProfileIcon from '@/assets/svg/user-profile.svg'
import LogoIcon from '@/assets/svg/logo.svg'

import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'

const GNB = () => {
  const { accessToken } = useAuthStore()
  const { nickname, fetchUser } = useUserStore()
  const [pageNumber, setPageNumber] = useState<number>(1)

  useEffect(() => {
    if (accessToken) {
      fetchUser()
    }
  }, [accessToken, fetchUser])

  const handleLogoClick = () => {}
  const handleHomeClick = () => {
    setPageNumber(1)
  }
  const handleRankClick = () => {
    setPageNumber(2)
  }
  const handleMogakClick = () => {
    setPageNumber(3)
  }

  return (
    <div className="flex justify-between items-center text-center bg-bg h-[60px] z-[60]">
      <Image
        src={LogoIcon}
        alt="로고"
        onClick={handleLogoClick}
        className="ml-[80px] cursor-pointer"
        width={48}
        height={24}
      />

      <div className="flex">
        <div
          className={`pr-[52px] text-16 font-semibold cursor-pointer ${pageNumber === 1 ? 'text-white' : 'text-grayscale-500'}`}
          onClick={handleHomeClick}
        >
          홈
        </div>
        <div
          className={`pr-[52px] text-16 font-semibold cursor-pointer ${pageNumber === 2 ? 'text-white' : 'text-grayscale-500'}`}
          onClick={handleRankClick}
        >
          작업자 랭킹
        </div>
        <div
          className={`text-16 font-semibold cursor-pointer ${pageNumber === 3 ? 'text-white' : 'text-grayscale-500'}`}
          onClick={handleMogakClick}
        >
          모각그라운드란
        </div>
      </div>
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
    </div>
  )
}

export default GNB
