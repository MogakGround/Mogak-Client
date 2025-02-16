import { TimeDisplayType } from './TimeDisplay'
import TimeDisplay from './TimeDisplay'

export default function MyLank() {
  return (
    <div className="flex flex-col w-[308px] h-[169px] rounded-[12px] overflow-hidden bg-grayscale-700 p-[24px]">
      <h4 className="med-18 mb-[16px] text-grayscale-50">내 랭킹</h4>
      <div className="h-[45px] flex items-end gap-[8px] text-white mb-[8px]">
        <span className="font-riasans text-[32px]">165</span>
        <span className="pb-[7px]">위</span>
      </div>
      <div className="flex">
        <TimeDisplay hours={16} minutes={26} seconds={41} type={TimeDisplayType.small} />
      </div>
    </div>
  )
}
