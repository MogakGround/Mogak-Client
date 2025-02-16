import Image from 'next/image'

import BannerLineIcon from '@/assets/svg/banner-line.svg'
import BannerBlockIcon from '@/assets/svg/banner-block.svg'
import RankFirstIcon from '@/assets/svg/rank-first.svg'
import RankSecondIcon from '@/assets/svg/rank-second.svg'
import RankThirdIcon from '@/assets/svg/rank-third.svg'
import RefreshIcon from '@/assets/svg/refresh-gray.svg'

export default function RankBanner() {
  return (
    <div className="relative bg-grayscale-800 rounded-[12px] w-full min-h-[224px] overflow-hidden pt-[34px] px-[40px]">
      <div className="flex flex-col gap-[39px]">
        <div className="flex flex-col text-white">
          <span className="med-20 mb-[2px]">작업 열정이 불타오르는</span>
          <span className="font-riasans text-[44px]">작업자 랭킹</span>
        </div>
        <div className="flex items-center">
          <Image src={RefreshIcon} alt="refresh" width={20} height={20} />
          <span className="ml-[4px] med-16 text-grayscale-300">오늘 15:30 기준</span>
          <span className="ml-[13px] reg-14 text-grayscale-400">
            하루 작업 시간과 랭킹은 매일 오전 5시에 초기화됩니다.
          </span>
        </div>
      </div>
      <Image
        src={BannerLineIcon}
        alt="rank"
        width={558}
        height={276}
        className="absolute top-[0px] right-[22%] rotate-[2deg]"
      />
      <Image src={BannerBlockIcon} alt="rank" width={558} height={276} className="absolute bottom-[0px] right-[0%]" />
      <Image src={RankFirstIcon} alt="rank" width={210} height={130} className="absolute top-[-50px] right-[176px]" />
      <Image
        src={RankSecondIcon}
        alt="rank"
        width={160}
        height={120}
        className="absolute top-[20px] right-[345px] rotate-[-12deg]"
      />
      <Image
        src={RankThirdIcon}
        alt="rank"
        width={135}
        height={104}
        className="absolute top-[90px] right-[78px] rotate-[11deg]"
      />
    </div>
  )
}
