'use client'

import { useState } from 'react'
import ProfileSettingModal from './ProfileSettingModal'
import { postAuthLogout } from '@/app/api/auth/api'
import { useAuthStore } from '@/store/authStore'
import LeaveModal from './LeaveModal'
import { useRouter } from 'next/navigation'

export default function ProfileSettingButton() {
  const router = useRouter()
  const { clearTokens } = useAuthStore()

  const [isProfileModal, setProfileModal] = useState(false)
  const [isLeaveModal, setLeaveModal] = useState(false)

  const handleLogout = async () => {
    try {
      await postAuthLogout()
      clearTokens()
      router.push('/auth/signin')
    } catch {
      clearTokens()
      router.push('/auth/signin')
    }
  }

  return (
    <div className="flex-row bg-gray-700 rounded-[12px] p-[8px] w-[106px]">
      <button
        className="text-grayscale-50 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600"
        onClick={() => setProfileModal(true)}
      >
        프로필 수정
      </button>
      <button
        className="text-grayscale-50 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600"
        onClick={handleLogout}
      >
        로그아웃
      </button>
      <button
        className="text-grayscale-300 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600"
        onClick={() => setLeaveModal(true)}
      >
        회원 탈퇴
      </button>

      {isProfileModal && (
        <ProfileSettingModal isOpen={isProfileModal} handleCloseModal={() => setProfileModal(false)} />
      )}

      {isLeaveModal && <LeaveModal isOpen={isLeaveModal} handleCloseModal={() => setLeaveModal(false)} />}
    </div>
  )
}
