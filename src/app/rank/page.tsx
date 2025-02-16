'use client'
import { useState } from 'react'

import Pagenation from '@/components/global/pagenation/Pagenation'
import RankList from '@/components/rank/rankList'
import MyLank from '@/components/rank/MyLank'
import RankBanner from '@/components/rank/RankBanner'

export default function RankPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(10)

  return (
    <div className="h-full mx-auto px-[80px] pt-[60px]">
      <div className="h-full max-w-[1280px] mx-auto flex flex-col gap-[40px]">
        <RankBanner />
        <div className="h-full w-full flex gap-[40px]">
          <div className="flex flex-col items-center justify-between gap-[40px] flex-1">
            {/* TODO: 10개씩 페이지네이션 처리 */}
            <RankList currentPage={currentPage} lastPage={lastPage} />
            <div className="pb-[64px]">
              <Pagenation currentPageNumber={currentPage} lastPageNumber={lastPage} handlePageChange={() => {}} />
            </div>
          </div>
          <MyLank />
        </div>
      </div>
    </div>
  )
}
