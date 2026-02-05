'use client'

import Pagenation from '@/components/global/pagenation/Pagenation'
import RankList from '@/app/rank/components/rankList'
import MyRank from '@/app/rank/components/MyRank'
import RankBanner from '@/app/rank/components/RankBanner'
import { useState } from 'react'
import { useGetRankingList, useGetMyRanking } from './queries'
import { MyRankingResponseData } from '@/app/api/user/user.types'

const DEFAULT_MY_RANKING: MyRankingResponseData = { userId: 0, nickName: '', rank: 0, hour: 0, min: 0, sec: 0 }

export default function RankPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: rankingData } = useGetRankingList(currentPage)
  const { data: myRanking, dataUpdatedAt, refetch: refetchMyRanking } = useGetMyRanking()

  const rankList = rankingData?.rankings ?? []
  const lastPage = rankingData?.lastPage ?? 1

  const currentDate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    : ''

  return (
    <div className="h-full mx-auto px-[80px] pt-[60px]">
      <div className="h-full max-w-[1280px] mx-auto flex flex-col gap-[40px]">
        <RankBanner handleRefresh={() => refetchMyRanking()} currentDate={currentDate} />
        <div className="h-full w-full flex gap-[40px]">
          <div className="flex flex-col items-center justify-between gap-[40px] flex-1">
            <RankList currentPage={currentPage} lastPage={lastPage} rankList={rankList} />
            {rankList.length === 0 ? (
              <div className="flex justify-center items-center h-full pb-[60px]">
                <span className="text-grayscale-50">아직 등록된 랭킹이 없어요.</span>
              </div>
            ) : (
              <div className="pb-[64px]">
                <Pagenation
                  currentPageNumber={currentPage}
                  lastPageNumber={lastPage}
                  handlePageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
          <MyRank myRanking={myRanking ?? DEFAULT_MY_RANKING} />
        </div>
      </div>
    </div>
  )
}
