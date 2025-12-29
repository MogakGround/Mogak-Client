'use client'
import React from 'react'

import { paginationButtonStyle } from './pagenation.style'

import Image from 'next/image'
import FirstIcon from '@/assets/svg/arrow-firstpage.svg'
import PrevIcon from '@/assets/svg/arrow-prevpage.svg'
import NextIcon from '@/assets/svg/arrow-nextpage.svg'
import LastIcon from '@/assets/svg/arrow-lastpage.svg'
import DisabledFirstIcon from '@/assets/svg/arrow-firstpage-disabled.svg'
import DisabledPrevIcon from '@/assets/svg/arrow-prevpage-disabled.svg'
import DisabledNextIcon from '@/assets/svg/arrow-nextpage-disabled.svg'
import DisabledLastIcon from '@/assets/svg/arrow-lastpage-disabled.svg'

interface PaginationProps {
  currentPageNumber: number
  lastPageNumber: number
  handlePageChange: (page: number) => void
}

const PAGES_PER_GROUP = 3
const BUTTON_SIZE = 30

const Pagination = ({ currentPageNumber, lastPageNumber, handlePageChange }: PaginationProps) => {
  // 현재 페이지가 속한 그룹의 시작 페이지 번호 (1, 11, 21, ...)
  const currentGroupStart = Math.floor((currentPageNumber - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1

  // 현재 페이지가 속한 그룹의 끝 페이지 번호
  const currentGroupEnd = Math.min(currentGroupStart + PAGES_PER_GROUP - 1, lastPageNumber)

  // 첫 번째 그룹인지 (이전 그룹이 없는지)
  const isFirstGroup = currentGroupStart === 1

  // 마지막 그룹인지 (다음 그룹이 없는지)
  const isLastGroup = currentGroupEnd === lastPageNumber

  // 첫 페이지로 이동
  const goToFirstPage = () => {
    if (currentPageNumber !== 1) {
      handlePageChange(1)
    }
  }

  // 마지막 페이지로 이동
  const goToLastPage = () => {
    if (currentPageNumber !== lastPageNumber) {
      handlePageChange(lastPageNumber)
    }
  }

  // 이전 그룹의 마지막 페이지로 이동
  const goToPrevGroup = () => {
    const prevGroupLastPage = currentGroupStart - 1
    if (prevGroupLastPage >= 1) {
      handlePageChange(prevGroupLastPage)
    }
  }

  // 다음 그룹의 첫 페이지로 이동
  const goToNextGroup = () => {
    const nextGroupFirstPage = currentGroupEnd + 1
    if (nextGroupFirstPage <= lastPageNumber) {
      handlePageChange(nextGroupFirstPage)
    }
  }

  // 현재 그룹에서 보여줄 페이지 번호 배열 생성
  const pageNumbers = Array.from(
    { length: currentGroupEnd - currentGroupStart + 1 },
    (_, index) => currentGroupStart + index
  )

  return (
    <div className="flex items-center justify-center">
      {/* << 버튼 - 첫 페이지로 이동 */}
      <button onClick={goToFirstPage} disabled={isFirstGroup}>
        <Image
          src={isFirstGroup ? DisabledFirstIcon : FirstIcon}
          alt="FirstIcon"
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
        />
      </button>

      {/* < 버튼 - 이전 페이지 그룹으로 이동 */}
      <button onClick={goToPrevGroup} disabled={isFirstGroup} className="mr-2">
        <Image
          src={isFirstGroup ? DisabledPrevIcon : PrevIcon}
          alt="PrevIcon"
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
        />
      </button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={`mx-[3px] ${currentPageNumber === pageNumber ? paginationButtonStyle.current : paginationButtonStyle.default}`}
        >
          <p
            className={
              currentPageNumber === pageNumber ? paginationButtonStyle.currentText : paginationButtonStyle.defaultText
            }
          >
            {pageNumber}
          </p>
        </button>
      ))}

      {/* > 버튼 - 다음 페이지 그룹으로 이동 */}
      <button onClick={goToNextGroup} disabled={isLastGroup} className="ml-2">
        <Image
          src={isLastGroup ? DisabledNextIcon : NextIcon}
          alt="NextIcon"
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
        />
      </button>

      {/* >> 버튼 - 마지막 페이지로 이동 */}
      <button onClick={goToLastPage} disabled={isLastGroup}>
        <Image
          src={isLastGroup ? DisabledLastIcon : LastIcon}
          alt="LastIcon"
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
        />
      </button>
    </div>
  )
}

export default Pagination
