'use client'

import Image from 'next/image'
import NoMogakIcon from '@/assets/svg/home/no-mogakrooms.svg'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import Link from 'next/link'

export default function NoMogakRoom({ recent }: { recent: boolean }) {
  // 모각방 만들기 버튼
  const handleCreateMogakRoom = () => {}

  return (
    <div className="flex-row w-full">
      <div className="flex justify-center items-center">
        <Image src={NoMogakIcon} alt="no-mogakrooms" className="w-[117px] h-[98px]" />
      </div>
      <div className="mt-[20px]">
        <div className="flex justify-center items-center">
          {/* 최근 모각방 or 시간대별 모각방 */}
          {recent ? (
            <p className="semi-20 text-white ">모각방이 아직 없어요</p>
          ) : (
            <p className="semi-20 text-white ">조건에 맞는 모각방이 아직 없어요</p>
          )}
        </div>
        <div className="flex justify-center items-center">
          {recent ? (
            <p className="reg-14 text-grayscale-400">역사적인 최초의 모각방을 만들어볼까요?</p>
          ) : (
            <p className="reg-14 text-grayscale-400">이 시간대 최초의 모각방을 만들어볼까요?</p>
          )}
        </div>
      </div>
      <Link href="/room/new">
        <div className="flex justify-center items-center mt-[31px]">
          <BasicButton
            size={ButtonSize.md}
            theme={ButtonTheme.primary}
            variant={ButtonVariant.filled}
            text="모각방 만들기"
            handleClick={handleCreateMogakRoom}
          />
        </div>
      </Link>
    </div>
  )
}
