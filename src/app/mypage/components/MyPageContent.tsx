'use client'

import Image from 'next/image'
import { useGetMyProfile } from '../queries'
import ProfileSection from './ProfileSection'
import StatsSection from './StatsSection'
import RoomTabs from './RoomTabs'

export default function MyPageContent() {
  const { data: profile, isLoading } = useGetMyProfile()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Image src={'/images/spinner.gif'} alt="로딩" width={52} height={52} />
      </div>
    )
  }

  return (
    <div>
      {/* 프로필 */}
      <div className="flex justify-between items-start w-full px-[80px] mt-[40px] h-[162px]">
        <ProfileSection nickname={profile?.nickName ?? ''} profileLink={profile?.portfolioUrl ?? ''} />
        <StatsSection
          workHours={profile?.hour?.toString() ?? '00'}
          workMinutes={profile?.min?.toString() ?? '00'}
          workSeconds={profile?.sec?.toString() ?? '00'}
          rank={profile?.rank?.toString() ?? '0'}
        />
      </div>

      <RoomTabs />
    </div>
  )
}
