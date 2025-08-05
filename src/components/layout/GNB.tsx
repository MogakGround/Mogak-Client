'use client'
import React, { useMemo } from 'react'
import Image from 'next/image'
import LogoIcon from '@/assets/svg/logo.svg'
import { useRouter, usePathname } from 'next/navigation'
import HeaderProfile from './components/HeaderProfile'

const GNB = () => {
  const pathname = usePathname()

  const { push } = useRouter()

  // 현재 경로에 따라 페이지 번호를 계산
  const pageNumber = useMemo(() => {
    if (pathname === '/') return 1
    if (pathname === '/rank') return 2
    if (pathname === '/mogak') return 3
    return 1
  }, [pathname])

  const handleLogoClick = () => {
    push('/')
  }
  const handleHomeClick = () => {
    push('/')
  }
  const handleRankClick = () => {
    push('/rank')
  }
  const handleMogakClick = () => {
    window.open('https://mogakjak.framer.website/?editSite', '_blank')
  }

  return (
    <div className=" bg-bg h-[60px] z-[60] px-80 w-full  min-w-720 flex items-center">
      <div className="w-full flex justify-between items-center text-center max-w-[1280px] mx-auto">
        <Image
          src={LogoIcon}
          alt="로고"
          onClick={handleLogoClick}
          className="cursor-pointer flex-shrink-0"
          width={48}
          height={24}
        />

        <div className="flex flex-shrink-0">
          <div
            className={`pr-[52px] text-16 font-semibold cursor-pointer transition-colors duration-200 ${pageNumber === 1 ? 'text-white' : 'text-grayscale-500'}`}
            onClick={handleHomeClick}
          >
            홈
          </div>
          <div
            className={`pr-[52px] text-16 font-semibold cursor-pointer transition-colors duration-200 ${pageNumber === 2 ? 'text-white' : 'text-grayscale-500'}`}
            onClick={handleRankClick}
          >
            작업자 랭킹
          </div>
          <div
            className={`text-16 font-semibold cursor-pointer transition-colors duration-200 ${pageNumber === 3 ? 'text-white' : 'text-grayscale-500'}`}
            onClick={handleMogakClick}
          >
            모각그라운드란
          </div>
        </div>
        <div className="flex-shrink-0">
          <HeaderProfile />
        </div>
      </div>
    </div>
  )
}

export default GNB
