import Modal from '@/components/global/modal/Modal'
import CheckAccentIcon from '@/assets/svg/check-accent.svg'
import Image from 'next/image'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import { useEffect, useState } from 'react'
import cn from '@/utils/cn'

interface ProfileSettingModalProps {
  nickname: string
  setNickname: (nickname: string) => void
  link: string
  setLink: (nickname: string) => void
  isOpen: boolean
  handleCloseModal: () => void
}

export default function ProfileSettingModal({
  nickname,
  setNickname,
  link,
  setLink,
  isOpen,
  handleCloseModal,
}: ProfileSettingModalProps) {
  const [newNickname, setNewNickname] = useState('')
  const [newLink, setNewLink] = useState('')

  // 중복 확인 이벤트
  const [isChecked, setChecked] = useState<boolean>(false)
  const [error, setError] = useState('') // 에러 메시지 상태
  const handleCheckNickname = (nickname: string) => {
    // 정규 표현식: 한글, 영어만 허용하고 공백 포함 16자 이내
    const regex = /^[a-zA-Z가-힣\s]+$/

    // 닉네임이 비어있으면
    if (!nickname.trim()) {
      setError('닉네임을 입력하세요')
      return
    }

    // 닉네임이 16자 이상이면
    if (nickname.trim().length > 16) {
      setError('닉네임은 16자 이내로 입력해야 합니다.')
      return
    }

    // 한글, 영어, 공백 외 다른 게 있으면면
    if (!regex.test(nickname)) {
      setError('닉네임은 한글과 영어, 공백만 포함할 수 있습니다.')
      return
    }

    // 에러가 없음
    setError('') // 에러 메시지 초기화
    setChecked(true) // 중복 확인 완료
  }
  useEffect(() => {
    setChecked(false)
  }, [newNickname])

  // 제출 이벤트
  const handleSubmit = () => {
    if (!isChecked) return

    if (newNickname) setNickname(newNickname)

    if (newLink) setLink(newLink)
    //handleCloseModal();   // 모달창 닫기
  }

  return (
    <Modal isOpen={isOpen} handleCloseModal={handleCloseModal} hasOverlay={false} closeOnOutsideClick={false}>
      <div className="mb-[40px]">
        <p className="semi-20 text-grayscale-50 mb-[40px]">프로필 수정하기</p>

        {/* 닉네임 */}
        <div className="flex items-center">
          <p className="semi-16 text-grayscale-50 mr-[8px]">닉네임</p>
          <p className="reg-12 text-accent-100">필수</p>
        </div>

        <div className="flex items-center mt-[6px] gap-[8px]">
          {/* 닉네임 입력 */}
          <input
            type="text"
            className="bg-grayscale-800 rounded-[8px] w-[268px] cursor-pointer reg-16 text-grayscale-50 px-[16px] py-[11px] focus:outline-none focus:outline-[1px] focus:bg-accentT-5 focus:outline-accentT-30"
            placeholder={nickname ? nickname : '닉네임을 입력해주세요.'}
            onChange={(e) => setNewNickname(e.target.value)}
          />
          {/* 버튼 */}
          <button
            className={cn('rounded-[8px]', !isChecked ? 'bg-grayscale-50' : 'bg-grayscale-600')}
            onClick={() => handleCheckNickname(newNickname)}
          >
            <p className={cn('semi-16 px-[17px] py-[12px]', !isChecked ? 'text-grayscale-800' : 'text-grayscale-400')}>
              중복확인
            </p>
          </button>
        </div>

        {/* 닉네임 부가 설명 */}
        <div className="flex items-center mt-[8px]">
          <Image src={CheckAccentIcon} alt="check" className="w-[20px] h-[20px] mr-[2px]" />
          <p className="reg-12 text-accent-100 mr-[16px]">공백 포함 16자 이내</p>
          <Image src={CheckAccentIcon} alt="check" className="w-[20px] h-[20px] mr-[2px]" />
          <p className="reg-12 text-accent-100 ">한글,영어로만 구성</p>
        </div>

        {/* 포트폴리오 */}
        <div className="flex items-center mt-[32px]">
          <p className="semi-16 text-grayscale-50 mr-[8px]">포트폴리오 링크</p>
          <p className="reg-12 text-grayscale-300">선택</p>
        </div>

        {/* 포트폴리오 입력 */}
        <input
          type="text"
          className="bg-grayscale-800 rounded-[8px] w-[368px] mt-[6px] cursor-pointer reg-16 text-grayscale-50 px-[16px] py-[11px] focus:outline-none focus:outline-[1px] focus:bg-accentT-5 focus:outline-accentT-30"
          placeholder={link ? link : '포트폴리오 링크를 입력해주세요.'}
          onChange={(e) => setNewLink(e.target.value)}
        />

        {/* 모달 버튼 */}
        <div className="flex mt-[60px]">
          <div className="w-[96px] mr-[13px]">
            <BasicButton
              theme={ButtonTheme.text}
              variant={ButtonVariant.default}
              size={ButtonSize.xxl}
              text="닫기"
              fullWidth={true}
              handleClick={handleCloseModal}
            />
          </div>
          <button type="submit" className="w-[259px]">
            <BasicButton
              theme={!isChecked ? ButtonTheme.white : ButtonTheme.primary}
              variant={!isChecked ? ButtonVariant.default : ButtonVariant.filled}
              size={ButtonSize.xxl}
              text="수정 완료하기"
              fullWidth={true}
              handleClick={handleSubmit}
              disabled={!isChecked}
            />
          </button>
        </div>
      </div>
    </Modal>
  )
}
