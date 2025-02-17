'use client'

export default function ProfileSettingButton() {
  return (
    <div className="flex-row bg-gray-700 rounded-[12px] p-[8px] w-[106px]">
      <p className="text-grayscale-50 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600">프로필 수정</p>
      <p className="text-grayscale-50 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600">로그아웃</p>
      <p className="text-grayscale-300 med-14 p-[8px] cursor-pointer rounded-[6px] hover:bg-gray-600">회원 탈퇴</p>
    </div>
  )
}
