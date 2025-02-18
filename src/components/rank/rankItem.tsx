import TimeDisplay, { TimeDisplayType } from './TimeDisplay'
import Image from 'next/image'

import RankFirstIcon from '@/assets/svg/rank-first.svg'
import RankSecondIcon from '@/assets/svg/rank-second.svg'
import RankThirdIcon from '@/assets/svg/rank-third.svg'

interface IRankItemProps {
  rank: number
  nickname: string
  time: number
}

export default function RankItem({ rank, nickname, time }: IRankItemProps) {
  return (
    <div className="h-[56px] flex justify-between cursor-default text-grayscale-50 hover:bg-grayscale-800 rounded-[11px] px-[4px] pr-[20px]">
      <div className="flex items-center gap-[16px]">
        <div className="w-[77px] h-[48px] flex items-center justify-center">
          {rank === 1 && <Image src={RankFirstIcon} alt="rank" width={77} height={48} />}
          {rank === 2 && <Image src={RankSecondIcon} alt="rank" width={77} height={48} />}
          {rank === 3 && <Image src={RankThirdIcon} alt="rank" width={77} height={48} />}
          {rank > 3 && (
            <span className="font-riasans text-[20px] line-28 bg-grayscale-800 rounded-[8px] px-[12px] py-[6px]">
              {rank}
            </span>
          )}
        </div>
        <span className="semi-18">{nickname}</span>
      </div>
      <TimeDisplay
        hours={Math.floor(time / 3600)}
        minutes={Math.floor((time % 3600) / 60)}
        seconds={time % 60}
        type={TimeDisplayType.large}
      />
    </div>
  )
}
