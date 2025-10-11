'use client'

import { useState } from 'react'
import ProfileSettingModal from './ProfileSettingModal'
import { postAuthDelete, postAuthLogout } from '@/app/api/auth/api'
import { useAuthStore } from '@/store/authStore'
import LeaveModal from './LeaveModal'
import { useRouter } from 'next/navigation'

interface ProfileSettingButtonProps {
  nickname: string
  setNickname: (nickname: string) => void
  link: string
  setLink: (nickname: string) => void
}

export default function ProfileSettingButton({ nickname, setNickname, link, setLink }: ProfileSettingButtonProps) {
  const router = useRouter()
  const [isProfileModal, setProfileModal] = useState(false)
  const handleProfileSetting = () => {
    setProfileModal(true)
  }

  const [isLeaveModal, setLeaveModal] = useState(false)
  const handleLeave = () => {
    setLeaveModal(true)
  }

  const { clearTokens } = useAuthStore()

  const logout = async () => {
    try {
      await postAuthLogout()
      console.log('로그아웃을 성공했습니다.')
      clearTokens()
      router.push('/auth/signin')
    } catch (error: any) {
      console.error(error)
      clearTokens()
    }
  }

  return (
    <div className="flex-row bg-gray-700 rounded-[12px] p-[8px] w-[106px]">
      <button
        className="text-grayscale-50 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600"
        onClick={handleProfileSetting}
      >
        프로필 수정
      </button>
      <button className="text-grayscale-50 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600" onClick={logout}>
        로그아웃
      </button>
      <button
        className="text-grayscale-300 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600"
        onClick={handleLeave}
      >
        회원 탈퇴
      </button>
      {isProfileModal && (
        <ProfileSettingModal
          nickname={nickname}
          setNickname={setNickname}
          link={link}
          setLink={setLink}
          isOpen={isProfileModal}
          handleCloseModal={() => setProfileModal(false)}
        />
      )}

      {isLeaveModal && <LeaveModal isOpen={isLeaveModal} handleCloseModal={() => setLeaveModal(false)} />}
    </div>
  )
}
