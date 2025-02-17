'use client'

import Image from 'next/image'

export default function TodayBlock({
  icon,
  title,
  data1,
  data2 = '',
}: {
  icon: string
  title: string
  data1: string
  data2?: string
}) {
  return (
    <div className="flex-row bg-gray-900 border-gray-700 border-[1.5px] rounded-[12px] p-[20px] w-[307px]">
      <div className="flex items-center mb-[17px]">
        <Image src={icon} alt="icon" className="w-[24px] h-[24px]" />
        <p className="text-grayscale-300 semi-16 ml-[8px]">{title}</p>
      </div>
      <div className="flex items-center">
        <p className="font-RiaSans text-white text-[24px] text-extrabold">{data1}</p>
        <p className="text-grayscale-200 reg-20 ml-[8px] mr-[20px]">{data2 ? '분' : '위'}</p>
        {data2 && (
          <>
            <p className="font-RiaSans text-white text-[24px] text-extrabold">{data2}</p>
            <p className="text-grayscale-200 reg-20 ml-[8px]">초</p>
          </>
        )}
      </div>
    </div>
  )
}
