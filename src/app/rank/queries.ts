import { useQuery } from '@tanstack/react-query'
import { getRankingList, getMyRanking } from '@/app/api/user/api'
import { MyRankingResponseData } from '@/app/api/user/user.types'

const PAGE_SIZE = 10

export const useGetRankingList = (page: number) => {
  return useQuery({
    queryKey: ['rankingList', page],
    queryFn: () => getRankingList({ page, size: PAGE_SIZE }),
    select: (data) => ({
      rankings: data.rankings,
      lastPage: Math.ceil(data.totalPage !== 0 ? data.totalPage / PAGE_SIZE : 1),
    }),
  })
}

export const useGetMyRanking = () => {
  return useQuery<MyRankingResponseData>({
    queryKey: ['myRanking'],
    queryFn: getMyRanking,
  })
}
