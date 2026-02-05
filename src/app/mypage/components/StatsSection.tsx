import TodayBlock from '@/components/app/mypage/TodayBlock'
import TimeIcon from '@/assets/svg/mypage/time.svg'
import RankBarIcon from '@/assets/svg/mypage/rankbar.svg'

interface StatsSectionProps {
  workHours: string
  workMinutes: string
  workSeconds: string
  rank: string
}

export default function StatsSection({ workHours, workMinutes, workSeconds, rank }: StatsSectionProps) {
  return (
    <div className="flex">
      <TodayBlock
        title="오늘의 누적 작업시간"
        isRank={false}
        icon={TimeIcon}
        data1={workHours}
        data2={workMinutes}
        data3={workSeconds}
      />
      <div className="ml-[16px]">
        <TodayBlock title="오늘의 작업자 랭킹" isRank={true} icon={RankBarIcon} data3={rank} />
      </div>
    </div>
  )
}
