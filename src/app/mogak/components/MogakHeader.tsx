'use client'

import Image from 'next/image'
import MogakSvg from '@/assets/svg/mogak-banner-bg.svg'
import IconTextButton from '@/components/global/button/IconTextButton'
import IconPerson from '@/assets/svg/person.svg'
import IconLink from '@/assets/svg/link.svg'
import IconMenu from '@/assets/svg/menu.svg'
import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconButton from '@/components/global/button/IconButton'

export default function MogakHeader() {
  return (
    <div className="relative w-full min-h-142">
      <Image src={MogakSvg} alt="모각방 배경" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-[#0F1220] opacity-90"></div>
      <div className="relative z-10 flex justify-between h-full px-80 py-40">
        <div className="flex flex-col">
          <h1 className="text-24 font-ria">방 제목</h1>
          <p className="text-14 text-grayscale-200 reg-14">어쩌고저쩌고 설명</p>
        </div>
        <div className="flex items-center gap-8">
          <IconTextButton
            variant={ButtonVariant.filled}
            theme={ButtonTheme.white}
            size={ButtonSize.md}
            text="초대하기"
            handleClick={() => {}}
            iconArrow={IconArrow.right}
            iconSrc={IconLink}
          />
          <IconTextButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.white}
            size={ButtonSize.md}
            handleClick={() => {}}
            iconArrow={IconArrow.left}
            iconSrc={IconPerson}
            iconWidth={24}
          >
            <div className="ml-5">
              <span className="med-14">1 </span>
              <span className="reg-14 text-gray-400">/ 5</span>
            </div>
          </IconTextButton>
          <IconButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.white}
            size={ButtonSize.xl}
            handleClick={() => {}}
            iconSrc={IconMenu}
            className="h-36 w-36 px-0"
          />
        </div>
      </div>
    </div>
  )
}
