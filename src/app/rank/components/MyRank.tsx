import { MyRankingResponseData } from '@/app/api/user/user.types'
import TimeDisplay, { TimeDisplayType } from './TimeDisplay'

interface IMyRankProps {
  myRanking: MyRankingResponseData
}

export default function MyRank({ myRanking }: IMyRankProps) {
  return (
    <div className="flex flex-col w-[308px] h-[169px] rounded-[12px] overflow-hidden bg-grayscale-700 p-[24px]">
      <h4 className="med-18 mb-[16px] text-grayscale-50">내 랭킹</h4>
      <div className="h-[45px] flex items-end gap-[8px] text-white mb-[8px]">
        <span className="font-riasans text-[32px]">{myRanking.rank}</span>
        <span className="pb-[7px]">위</span>
      </div>
      <div className="flex">
        <TimeDisplay
          hours={myRanking.hour}
          minutes={myRanking.min}
          seconds={myRanking.sec}
          type={TimeDisplayType.small}
        />
      </div>
    </div>
  )
}
