'use client'

import Image from 'next/image'
import LogoIcon from '@/assets/svg/logo.svg'
import PensilGraySmIcon from '@/assets/svg/mypage/pensil-gray-sm.svg'
import LinkAccentLgIcon from '@/assets/svg/mypage/link-accent-lg.svg'
import { useState } from 'react'
import IconButton from '@/components/global/button/IconButton'
import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconTextButton from '@/components/global/button/IconTextButton'

export default function MyPage() {
  const [profileIcon, setProfileIcon] = useState<string>('')
  const [nickname, setNickname] = useState<string>('닉네임')

  return (
    <div>
      <div className="flex items-center">
        <div className="flex justify-center items-center rounded-full border-2 border-gray-600  w-[92px] h-[92px] bg-gray-800">
          {!profileIcon ? (
            <Image src={LogoIcon} alt="profile" width={48} height={24} />
          ) : (
            <Image src={profileIcon} alt="profile" />
          )}
        </div>
        <div className=" ml-[24px]">
          <div className="flex items-center gap-[16px]">
            <p className="text-gray-50 bold-32 ">{nickname}</p>
            <IconButton
              theme={ButtonTheme.white}
              variant={ButtonVariant.default}
              size={ButtonSize.sm}
              iconSrc={PensilGraySmIcon}
              handleClick={() => null}
            />
          </div>
          <IconTextButton
            theme={ButtonTheme.accent}
            variant={ButtonVariant.default}
            size={ButtonSize.lg}
            iconSrc={LinkAccentLgIcon}
            iconArrow={IconArrow.left}
            text="https://link"
            link={true}
            handleClick={() => null}
          />
        </div>
      </div>
    </div>
  )
}
