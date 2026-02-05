'use client'

import { FC, SVGProps } from 'react'
import Top1Icon from '@/assets/svg/mypage/1st.svg'
import Top2Icon from '@/assets/svg/mypage/2nd.svg'
import Top3Icon from '@/assets/svg/mypage/3rd.svg'
import cn from '@/utils/cn'

export default function TodayBlock({
  isRank,
  icon: Icon,
  title,
  data1,
  data2,
  data3,
}: {
  isRank: boolean
  icon: FC<SVGProps<SVGSVGElement>>
  title: string
  data1?: string
  data2?: string
  data3: string
}) {
  return (
    <div
      className={cn(
        'flex relative bg-gray-900 border-gray-700 border-[1.5px] rounded-[12px] p-[20px] w-[307px] h-[122px]',
        !data2 && 'justify-between'
      )}
    >
      <div className="flex-row">
        <div className="flex items-center mb-[17px]">
          <Icon className="w-[24px] h-[24px]" />
          <p className="text-grayscale-300 semi-16 ml-[8px]">{title}</p>
        </div>
        <div className="flex items-center">
          {data1 && (
            <>
              <p className="font-RiaSans text-white text-[24px] text-extrabold">{data1}</p>
              <p className="text-grayscale-200 reg-20 ml-[8px] mr-[20px]">시간</p>
            </>
          )}

          {data2 && (
            <>
              <p className="font-RiaSans text-white text-[24px] text-extrabold">{data2}</p>
              <p className="text-grayscale-200 reg-20 ml-[8px] mr-[20px]">분</p>
            </>
          )}

          <>
            <p
              className={cn(
                'font-RiaSans text-[24px] text-extrabold',
                !isRank ? 'text-white' : ['1', '2', '3'].includes(data3) ? 'text-accent-100' : 'text-white'
              )}
            >
              {data3}
            </p>
            <p
              className={cn(
                'reg-20 ml-[8px] mr-[20px]',
                !isRank
                  ? 'text-grayscale-200'
                  : ['1', '2', '3'].includes(data3)
                    ? 'text-accent-100'
                    : 'text-grayscale-200'
              )}
            >
              {!isRank ? '초' : '위'}
            </p>
          </>
        </div>
      </div>

      {isRank && (
        <div className="absolute right-[20px] bottom-[10px]">
          {data3 === '1' ? (
            <Top1Icon className="h-[60px]" />
          ) : data3 === '2' ? (
            <Top2Icon className="h-[60px]" />
          ) : data3 === '3' ? (
            <Top3Icon className="h-[60px]" />
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  )
}
