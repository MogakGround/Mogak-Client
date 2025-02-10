'use client'
import React, { useEffect } from 'react'

import { pagenationTextStyle, pagenationBgStyle } from './pagenation.style'

import Image from 'next/image'
import FirstIcon from '@/assets/svg/arrow-firstpage.svg'
import PrevIcon from '@/assets/svg/arrow-prevpage.svg'
import NextIcon from '@/assets/svg/arrow-nextpage.svg'
import LastIcon from '@/assets/svg/arrow-lastpage.svg'
import DisabledFirstIcon from '@/assets/svg/arrow-firstpage-disabled.svg'
import DisabledPrevIcon from '@/assets/svg/arrow-prevpage-disabled.svg'
import DisabledNextIcon from '@/assets/svg/arrow-nextpage-disabled.svg'
import DisabledLastIcon from '@/assets/svg/arrow-lastpage-disabled.svg'

interface PagenationProps {
  currentPageNumber: number
  lastPageNumber: number
  handlePageChange: (page: number) => void // const [currentPage, setCurrentPage] = useState(1);에서 setCurrentPage 주셈
}

const Pagenation = ({ currentPageNumber, lastPageNumber, handlePageChange }: PagenationProps) => {
  const firstPageNumber = 1 // 시작 페이지 번호
  const unit = 10 // 페이지 단위  (보여줄 딘위)
  const buttonSize = 30 // 버튼 크기

  // 첫 페이지 그룹에 속함
  const isFirstGroup = currentPageNumber <= unit
  // 막 페이지 그룹에 속함  // 자바스크립트에서 나눗셈은 부동소수점 숫자를 반환하기 때문에 Math.floor로 소수점 버리기
  const isLastGroup = currentPageNumber > Math.floor(lastPageNumber / unit) * unit
  /*const isLastGroup =
    currentPageNumber > Math.floor(lastPageNumber / unit) * unit + firstPageNumber &&
    currentPageNumber <= Math.floor(lastPageNumber / unit) * unit + unit*/

  // 현재 페이지의 시작 그룹 번호
  const startGroupNumber = Math.floor((currentPageNumber - 1) / unit) * unit + firstPageNumber

  const handleFirstPage = () => {
    handlePageChange(firstPageNumber)
  }
  const handleLastPage = () => {
    handlePageChange(lastPageNumber)
  }
  const handlePrevPageGroup = () => {
    if (currentPageNumber - unit < firstPageNumber) {
      handleFirstPage()
      return
    }

    // 이전 페이지 그룹의 마지막 페이지 번호
    const pageNumber = Math.floor((currentPageNumber - 1) / unit) * unit

    handlePageChange(pageNumber)
  }
  const handleNextPageGroup = () => {
    if (currentPageNumber + unit >= lastPageNumber) {
      handlePageChange(Math.floor(lastPageNumber / unit) * unit + firstPageNumber)
      return
    }

    // 다음 페이지 그룹의 시작 페이지 번호
    const pageNumber = Math.floor((currentPageNumber - 1) / unit) * unit + unit + firstPageNumber

    handlePageChange(pageNumber)
  }

  return (
    <div className="flex items-center">
      {/* << 버튼 - 첫 페이지로 이동 */}
      <button onClick={handleFirstPage} disabled={isFirstGroup}>
        <Image
          src={isFirstGroup ? DisabledFirstIcon : FirstIcon}
          alt="FirstIcon"
          width={buttonSize}
          height={buttonSize}
        />
      </button>

      {/* < 버튼 - 이전 페이지 그룹으로 이동 */}
      <button onClick={handlePrevPageGroup} disabled={isFirstGroup} className="mr-2">
        <Image src={isFirstGroup ? DisabledPrevIcon : PrevIcon} alt="PrevIcon" width={buttonSize} height={buttonSize} />
      </button>

      {/* 페이지 버튼들 */}
      {Array.from({ length: unit }, (_, index) =>
        startGroupNumber + index <= lastPageNumber ? (
          <button
            key={index}
            onClick={() => handlePageChange(startGroupNumber + index)}
            className={`mx-[3px] ${currentPageNumber === startGroupNumber + index ? pagenationBgStyle.current : pagenationBgStyle.extra}`}
          >
            <p
              className={`${currentPageNumber === startGroupNumber + index ? pagenationTextStyle.current : pagenationTextStyle.extra}`}
            >
              {startGroupNumber + index}
            </p>
          </button>
        ) : (
          <p key={index} className="mx-[3px] w-[24px]" />
        )
      )}

      {/* > 버튼 - 다음 페이지 그룹으로 이동 */}
      <button onClick={handleNextPageGroup} disabled={isLastGroup} className="ml-2">
        <Image src={isLastGroup ? DisabledNextIcon : NextIcon} alt="NextIcon" width={buttonSize} height={buttonSize} />
      </button>

      {/* >> 버튼 - 마지막 페이지로 이동 */}
      <button onClick={handleLastPage} disabled={isLastGroup}>
        <Image src={isLastGroup ? DisabledLastIcon : LastIcon} alt="LastIcon" width={buttonSize} height={buttonSize} />
      </button>
    </div>
  )
}

export default Pagenation
