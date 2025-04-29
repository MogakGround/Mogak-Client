import { useCallback, useEffect, useState } from 'react'
import { getRankingList, getMyRanking } from '@/app/api/user/api'
import { MyRankingResponseData } from '@/app/api/user/user.types'

const PAGE_SIZE = 10
export default function useFetchRank() {
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(10)
  const [rankList, setRankList] = useState<MyRankingResponseData[]>([])
  const [myRanking, setMyRanking] = useState<MyRankingResponseData>({
    userId: 0,
    nickName: '',
    rank: 0,
    hour: 0,
    min: 0,
    sec: 0,
  })
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    fetchMyRanking()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const fetchMyRanking = async () => {
    const ranking = await getMyRanking()
    const formattedTime = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    setMyRanking(ranking)
    setCurrentDate(formattedTime)
  }

  const fetchRankingList = useCallback(async () => {
    const res = await getRankingList({ page: currentPage, size: PAGE_SIZE })
    setLastPage(Math.ceil(res.totalPage !== 0 ? res.totalPage / PAGE_SIZE : 1))
    setRankList(res.rankings)
  }, [currentPage])

  useEffect(() => {
    fetchRankingList()
  }, [fetchRankingList])

  return { currentPage, lastPage, rankList, currentDate, myRanking, fetchMyRanking, handlePageChange }
}
