import BannerLineIcon from '@/assets/svg/banner-line.svg'
import BannerBlockIcon from '@/assets/svg/banner-block.svg'
import RankFirstIcon from '@/assets/svg/rank-first.svg'
import RankSecondIcon from '@/assets/svg/rank-second.svg'
import RankThirdIcon from '@/assets/svg/rank-third.svg'
import RefreshIcon from '@/assets/svg/refresh-gray.svg'

interface IRankBannerProps {
  handleRefresh: () => void
  currentDate: string
}

export default function RankBanner({ handleRefresh, currentDate }: IRankBannerProps) {
  return (
    <div className="relative bg-grayscale-800 rounded-[12px] w-full min-h-[180px] md:min-h-[224px] overflow-hidden pt-[24px] md:pt-[34px] px-[20px] md:px-[40px]">
      <div className="flex flex-col gap-[24px] md:gap-[39px]">
        <div className="flex flex-col text-white">
          <span className="med-20 mb-[2px]">작업 열정이 불타오르는</span>
          <span className="font-riasans text-[32px] md:text-[44px]">작업자 랭킹</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center z-10 gap-[4px] md:gap-0 pb-[20px] md:pb-0">
          <div className="flex items-center">
            <RefreshIcon onClick={handleRefresh} className="cursor-pointer" />
            <span className="ml-[4px] med-16 text-grayscale-300">오늘 {currentDate.toLocaleString()} 기준</span>
          </div>
          <span className="md:ml-[13px] reg-14 text-grayscale-400">
            하루 작업 시간과 랭킹은 매일 오전 5시에 초기화됩니다.
          </span>
        </div>
      </div>
      <BannerLineIcon className="absolute top-[0px] right-[22%] rotate-[2deg] hidden md:block" />
      <BannerBlockIcon className="absolute bottom-[0px] right-[0%]" />
      <RankFirstIcon className="absolute top-[-20px] md:top-[-30px] right-[10px] md:right-[100px] lg:right-[200px] w-[80px] h-[50px] md:w-[164px] md:h-[103px]" />
      <RankSecondIcon className="absolute top-[30px] md:top-[20px] right-[70px] md:right-[220px] lg:right-[345px] rotate-[-12deg] w-[70px] h-[53px] md:w-[160px] md:h-[120px]" />
      <RankThirdIcon className="absolute top-[80px] md:top-[100px] right-[-10px] md:right-[20px] lg:right-[70px] rotate-[11deg] w-[60px] h-[46px] md:w-[135px] md:h-[104px]" />
    </div>
  )
}
