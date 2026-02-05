'use client'

import { useState } from 'react'
import LogoIcon from '@/assets/svg/logo.svg'
import PensilGraySmIcon from '@/assets/svg/mypage/pensil-gray-sm.svg'
import LinkAccentLgIcon from '@/assets/svg/mypage/link-accent-lg.svg'
import IconButton from '@/components/global/button/IconButton'
import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconTextButton from '@/components/global/button/IconTextButton'
import ProfileSettingButton from '@/components/app/mypage/ProfileSettingButton'

const PROFILE_LINK_REGEX = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/

interface ProfileSectionProps {
  nickname: string
  profileLink: string
}

export default function ProfileSection({ nickname, profileLink }: ProfileSectionProps) {
  const [isSettingOpen, setIsSettingOpen] = useState(false)

  return (
    <div className="flex px-[20px]">
      {/* 프로필 이미지 */}
      <div className="flex justify-center items-center rounded-full border-2 border-gray-600 w-[92px] h-[92px] bg-gray-800">
        <LogoIcon width={48} height={24} />
      </div>

      <div className="ml-[24px]">
        <div className="flex items-center gap-[16px] mb-[8px]">
          <p className="text-gray-50 bold-32">{nickname}</p>
          <IconButton
            theme={ButtonTheme.white}
            variant={ButtonVariant.default}
            size={ButtonSize.sm}
            iconSrc={PensilGraySmIcon}
            handleClick={() => setIsSettingOpen(!isSettingOpen)}
          />
        </div>

        {profileLink &&
          (PROFILE_LINK_REGEX.test(profileLink) ? (
            <a href={profileLink} target="_blank" rel="noopener noreferrer">
              <IconTextButton
                theme={ButtonTheme.accent}
                variant={ButtonVariant.default}
                size={ButtonSize.lg}
                iconSrc={LinkAccentLgIcon}
                iconArrow={IconArrow.left}
                text={profileLink}
                link={true}
                handleClick={() => null}
              />
            </a>
          ) : (
            <IconTextButton
              theme={ButtonTheme.accent}
              variant={ButtonVariant.default}
              size={ButtonSize.lg}
              iconSrc={LinkAccentLgIcon}
              iconArrow={IconArrow.left}
              text={profileLink}
              link={true}
              handleClick={() => {}}
            />
          ))}
      </div>

      {isSettingOpen && (
        <div className="ml-[9px]">
          <ProfileSettingButton />
        </div>
      )}
    </div>
  )
}
