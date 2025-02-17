'use client'

import Image from 'next/image'
import { useState } from 'react'
import SunGrayMIcon from '@/assets/svg/sun-gray-m.svg'
import SundownGrayMIcon from '@/assets/svg/sun-down-gray-m.svg'
import SunupGrayMIcon from '@/assets/svg/sun-up-gray-m.svg'
import IconChip from '@/components/global/chip/IconChip'
import { ChipSize, ChipTheme, ChipVariant } from '@/components/global/chip/chip.types'
import MoonIconChip from '@/components/global/chip/MoonIconChip'
import HeadcountIconTextButton from '@/components/global/button/HeadcountIconTextButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'

export interface MogakRoomProps {
  index: number
  title: string
  description: string
  thumbnailImageSrc: string
  capacity: number
  headcount: number
  sunup: boolean
  sun: boolean
  sundown: boolean
  moon: boolean
}

export default function MogakRoom({
  index,
  title,
  description,
  thumbnailImageSrc,
  capacity,
  headcount,
  sunup,
  sun,
  sundown,
  moon,
}: MogakRoomProps) {
  const [hover, setHover] = useState(false)

  return (
    <div>
      <div
        className={`relative w-[305px] h-[160px] rounded-[10px] ${hover ? 'border-[1.5px] border-accentT-40 shadow-accentT60-25' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="absolute top-0 right-0 mt-[16px] mr-[16px]">
          <HeadcountIconTextButton
            theme={ButtonTheme.white}
            variant={ButtonVariant.default}
            size={ButtonSize.xs}
            capacity={capacity}
            headcount={headcount}
            handleClick={() => null}
          />
        </div>
        <Image src={thumbnailImageSrc} alt="thumbnail" className="w-[305px] h-[160px]" />
      </div>
      <div className="mx-[8px] mt-[16px]">
        <p className={`semi-16 ${hover ? 'text-accent-100' : 'text-white'}`}>{title}</p>
        <p className="reg-14 text-grayscale-400">{description}</p>
        <div className="flex mt-[16px] gap-[4px] ">
          {sunup && (
            <IconChip
              size={ChipSize.md}
              theme={ChipTheme.DARK}
              variant={ChipVariant.DEFAULT}
              iconImageSrc={SunupGrayMIcon}
              handleClick={() => null}
            />
          )}
          {sun && (
            <IconChip
              size={ChipSize.md}
              theme={ChipTheme.DARK}
              variant={ChipVariant.DEFAULT}
              iconImageSrc={SunGrayMIcon}
              handleClick={() => null}
            />
          )}
          {sundown && (
            <IconChip
              size={ChipSize.md}
              theme={ChipTheme.DARK}
              variant={ChipVariant.DEFAULT}
              iconImageSrc={SundownGrayMIcon}
              handleClick={() => null}
            />
          )}
          {moon && (
            <MoonIconChip
              size={ChipSize.md}
              theme={ChipTheme.DARK}
              variant={ChipVariant.DEFAULT}
              handleClick={() => null}
            />
          )}
        </div>
      </div>
    </div>
  )
}
