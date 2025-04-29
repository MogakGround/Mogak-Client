import RankItem from './rankItem'
import { MyRankingResponseData } from '@/app/api/user/user.types'

interface IRankListProps {
  currentPage: number
  lastPage: number
  rankList: MyRankingResponseData[]
}

export default function RankList({ rankList }: IRankListProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-[20px]">
        {rankList.map(({ nickName, rank, hour, min, sec }) => (
          <RankItem key={nickName} rank={rank} hour={hour} min={min} sec={sec} nickname={nickName} />
        ))}
      </div>
    </div>
  )
}
