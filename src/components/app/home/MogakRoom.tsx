'use client'

import Image from 'next/image'
import { useState } from 'react'
import SunGrayMIcon from '@/assets/svg/sun-gray-m.svg'
import SundownGrayMIcon from '@/assets/svg/sun-down-gray-m.svg'
import SunupGrayMIcon from '@/assets/svg/sun-up-gray-m.svg'
import SecretWhiteXSIcon from '@/assets/svg/secret-white-xs.svg'
import IconChip from '@/components/global/chip/IconChip'
import { ChipSize, ChipTheme, ChipVariant } from '@/components/global/chip/chip.types'
import MoonIconChip from '@/components/global/chip/MoonIconChip'
import HeadcountIconTextButton from '@/components/global/button/HeadcountIconTextButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import IconButton from '@/components/global/button/IconButton'
import cn from '@/utils/cn'
import { useRouter } from 'next/navigation'
import RoomPasswordModal from './RoomPasswordModal'
import { postEnterRoom } from '@/app/api/home/api'

export interface MogakRoomProps {
  index: number
  title: string
  description?: string
  thumbnailImageSrc: string
  capacity: number
  headcount: number
  sunup: boolean
  sun: boolean
  sundown: boolean
  moon: boolean
  secret: boolean
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
  secret,
}: MogakRoomProps) {
  const [hover, setHover] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { push } = useRouter()

  const handleClick = async () => {
    if (secret) {
      setIsPasswordModalOpen(true)
      return
    }
    if (isLoading) return
    setIsLoading(true)
    try {
      await postEnterRoom(index, {
        isScreenShared: false,
        isVideoLargeAllowed: false,
      })
      push(`/mogak/${index}`)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <div
        className={cn(
          'relative w-[305px] rounded-[10px] border-[1.5px] border-transparent',
          hover && 'border-accentT-40 shadow-accentT60-25'
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleClick}
      >
        <div className="absolute top-0 right-0 mt-[16px] mr-[16px]">
          <div className="flex items-center">
            {secret && (
              <span className="mr-[8px]">
                <IconButton
                  theme={ButtonTheme.white}
                  variant={ButtonVariant.default}
                  size={ButtonSize.xs}
                  iconSrc={SecretWhiteXSIcon}
                  handleClick={() => null}
                />
              </span>
            )}
            <HeadcountIconTextButton
              theme={ButtonTheme.white}
              variant={ButtonVariant.default}
              size={ButtonSize.xs}
              capacity={capacity}
              headcount={headcount}
              handleClick={() => null}
            />
          </div>
        </div>
        <Image src={thumbnailImageSrc} alt="thumbnail" width={305} height={160} />
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 rounded-[10px] flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-accent-100 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="mx-[8px] h-[96px] flex flex-col justify-between">
        <p className={cn('semi-16', hover ? 'text-accent-100' : 'text-white')}>{title}</p>
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

      <RoomPasswordModal
        roomId={index}
        isOpen={isPasswordModalOpen}
        handleCloseModal={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}
