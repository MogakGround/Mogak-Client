'use client'

import Pagenation from '@/components/global/pagenation/Pagenation'
import RankList from '@/app/rank/components/rankList'
import MyRank from '@/app/rank/components/MyRank'
import RankBanner from '@/app/rank/components/RankBanner'
import useFetchRank from './hooks/useFetchRank'

export default function RankPage() {
  const { currentPage, lastPage, rankList, currentDate, myRanking, fetchMyRanking, handlePageChange } = useFetchRank()

  return (
    <div className="h-full mx-auto px-[80px] pt-[60px]">
      <div className="h-full max-w-[1280px] mx-auto flex flex-col gap-[40px]">
        <RankBanner handleRefresh={fetchMyRanking} currentDate={currentDate} />
        <div className="h-full w-full flex gap-[40px]">
          <div className="flex flex-col items-center justify-between gap-[40px] flex-1">
            <RankList currentPage={currentPage} lastPage={lastPage} rankList={rankList} />
            {rankList.length === 0 ? (
              <div className="flex justify-center items-center h-full pb-[60px]">
                <span className="text-grayscale-50">랭킹이 없습니다.</span>
              </div>
            ) : (
              <div className="pb-[64px]">
                <Pagenation
                  currentPageNumber={currentPage}
                  lastPageNumber={lastPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}
          </div>
          <MyRank myRanking={myRanking} />
        </div>
      </div>
    </div>
  )
}
