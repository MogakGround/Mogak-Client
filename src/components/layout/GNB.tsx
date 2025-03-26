'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import LogoIcon from '@/assets/svg/logo.svg'

const GNB = () => {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const HeaderProfile = dynamic(() => import('./components/HeaderProfile'), { ssr: false })

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
      <HeaderProfile />
    </div>
  )
}

export default GNB
