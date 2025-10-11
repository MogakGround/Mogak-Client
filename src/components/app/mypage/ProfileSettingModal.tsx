import Modal from '@/components/global/modal/Modal'
import CheckAccentIcon from '@/assets/svg/check-accent.svg'
import Image from 'next/image'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import { ChangeEvent, useEffect, useState } from 'react'
import { patchMyProfile } from '@/app/api/mypage/api'
import { getCheckNickname } from '@/app/api/user/api'
import RoundedSquareButton from '@/components/global/button/RoundedSquareButton'
import BasicInput from '@/components/global/input/BasicInput'

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
  const [newNickname, setNewNickname] = useState(nickname)
  const [newLink, setNewLink] = useState(link)

  // 중복 확인 이벤트
  const [isValidateNickname, setIsValidateNickname] = useState<boolean>(true)
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false)
  const [error, setError] = useState('') // 에러 메시지 상태

  // 모달이 열릴 때마다 초기 상태 설정
  useEffect(() => {
    if (isOpen) {
      setNewNickname(nickname)
      setNewLink(link)
      setIsNicknameChecked(false)
      setError('')
      setIsValidateNickname(true)
    }
  }, [isOpen, nickname, link])

  const handleCheckNickname = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setNewNickname(name)
    setIsValidateNickname(true)
    // 정규 표현식: 한글, 영어만 허용하고 공백 포함 16자 이내
    const regex = /^[a-zA-Z가-힣\s]+$/
    
    // 닉네임이 비어있으면
    if (!name.trim()) {
      setError('닉네임을 입력하세요.')
      setIsValidateNickname(false)
      setIsNicknameChecked(false)
      return
    }

    // 닉네임이 16자 이상이면
    if (name.trim().length > 16) {
      setError('닉네임은 16자 이내로 입력해야 합니다.')
      setIsValidateNickname(false)
      setIsNicknameChecked(false)
      return
    }

    // 한글, 영어, 공백 외 다른 게 있으면면
    if (!regex.test(name)) {
      setError('닉네임은 한글과 영어, 공백만 포함할 수 있습니다.')
      setIsValidateNickname(false)
      setIsNicknameChecked(false)
      return
    }

    // 닉네임이 변경되었으므로 중복확인 필요
    setIsNicknameChecked(false)
  }

  const handlePortfoloLink = (e: ChangeEvent<HTMLInputElement>) => {
    setNewLink(e.target.value)
  }

  // 닉네임 중복 확인
  const checkNickname = async () => {
    if (newNickname === nickname || !isValidateNickname) return
    try {
      const data = await getCheckNickname({ nickname: newNickname })
      console.log('닉네임 중복 확인을 성공했습니다.')
      console.log(data)

      setError('') // 에러가 없음
      setIsNicknameChecked(true)
    } catch (error: any) {
      console.error(error)
      if (error.response) {
        const status = error.response.status
        switch (status) {
          case 404:
            //setError('요청한 리소스를 찾을 수 없습니다. (404)')
            break
          case 405:
            //setError('허용되지 않은 요청입니다. (405)')
            break
          case 409:
            setError('이미 사용 중인 닉네임입니다.')
            break
          case 500:
            //setError('서버 내부 오류가 발생했습니다.')
            break
          default:
            break
        }
      }
    }
  }

  // 프로필 수정
  const updateProfile = async () => {
    try {
      await patchMyProfile({
        nickName: newNickname,
        portfolioUrl: newLink,
      })
      console.log('프로필 수정을 성공했습니다.')
      handleCloseModal()
    } catch (error) {
      console.error(error)
    }
  }

  // 제출 이벤트
  const handleSubmit = () => {
    if (!isNicknameChecked) return

    if (newNickname) setNickname(newNickname)
    if (newLink) setLink(newLink)

    // API
    updateProfile()

    //handleCloseModal()   // 모달창 닫기
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

        <div className="flex items-center gap-[8px] mb-[8px]">
          <div className="flex-1">
            <BasicInput
              placeHolder="닉네임을 입력해주세요."
              size="small"
              name="nickname"
              value={newNickname}
              handleChange={handleCheckNickname}
            />
          </div>
          <RoundedSquareButton
            text="중복 확인"
            handleClick={checkNickname}
            disabled={!isValidateNickname}
          />
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
          onChange={handlePortfoloLink}
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
          <div className="w-[259px]">
            <BasicButton
              theme={isNicknameChecked ? ButtonTheme.white : ButtonTheme.primary}
              variant={!isNicknameChecked ? ButtonVariant.default : ButtonVariant.filled}
              size={ButtonSize.xxl}
              text="수정 완료하기"
              fullWidth={true}
              handleClick={handleSubmit}
              disabled={!isNicknameChecked}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
