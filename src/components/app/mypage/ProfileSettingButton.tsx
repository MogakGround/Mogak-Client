'use client'

import { useState } from 'react'
import ProfileSettingModal from './ProfileSettingModal'
import { postAuthDelete, postAuthLogout } from '@/app/api/auth/api'

interface ProfileSettingButtonProps {
  nickname: string
  setNickname: (nickname: string) => void
  link: string
  setLink: (nickname: string) => void
}

export default function ProfileSettingButton({ nickname, setNickname, link, setLink }: ProfileSettingButtonProps) {
  const [isModal, setModal] = useState(false)
  const handleProfileSetting = () => {
    setModal(true)
  }

  const logout = async () => {
    try {
      const data = await postAuthLogout()
      console.log('로그아웃을 성공했습니다.')
      console.log(data)
    } catch (error: any) {
      console.error(error)
    }
  }

  const leave = async () => {
    try {
      const data = await postAuthDelete()
      console.log('회원탈퇴에 성공했습니다.')
      console.log(data)
    } catch (error: any) {
      console.error(error)
    }
  }

  return (
    <div className="flex-row bg-gray-700 rounded-[12px] p-[8px] w-[106px]">
      <p
        className="text-grayscale-50 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600"
        onClick={handleProfileSetting}
      >
        프로필 수정
      </p>
      <p className="text-grayscale-50 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600" onClick={logout}>
        로그아웃
      </p>
      <p className="text-grayscale-300 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600" onClick={leave}>
        회원 탈퇴
      </p>

      {isModal && (
        <ProfileSettingModal
          nickname={nickname}
          setNickname={setNickname}
          link={link}
          setLink={setLink}
          isOpen={isModal}
          handleCloseModal={() => setModal(false)}
        />
      )}
    </div>
  )
}
