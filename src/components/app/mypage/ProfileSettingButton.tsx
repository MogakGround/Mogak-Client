'use client'

import { useState } from 'react'
import ProfileSettingModal from './ProfileSettingModal'

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

  const logout = () => {}

  const leave = () => {}

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
