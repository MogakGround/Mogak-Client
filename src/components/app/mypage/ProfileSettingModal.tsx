import Modal from '@/components/global/modal/Modal'
import CheckAccentIcon from '@/assets/svg/check-accent.svg'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import { ChangeEvent, useEffect, useState } from 'react'
import { getCheckNickname } from '@/app/api/user/api'
import { validateCommonText } from '@/utils/validate'
import RoundedSquareButton from '@/components/global/button/RoundedSquareButton'
import BasicInput from '@/components/global/input/BasicInput'
import { useGetMyProfile, useUpdateProfile } from '@/app/mypage/queries'

interface ProfileSettingModalProps {
  isOpen: boolean
  handleCloseModal: () => void
}

export default function ProfileSettingModal({ isOpen, handleCloseModal }: ProfileSettingModalProps) {
  const { data: profile } = useGetMyProfile()
  const { mutate: updateProfile } = useUpdateProfile()

  const currentNickname = profile?.nickName ?? ''
  const currentLink = profile?.portfolioUrl ?? ''

  const [newNickname, setNewNickname] = useState(currentNickname)
  const [newLink, setNewLink] = useState(currentLink)

  // 중복 확인 이벤트
  const [isValidateNickname, setIsValidateNickname] = useState<boolean>(true)
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false)
  const [isPortfolioLinkChecked, setIsPortfolioLinkChecked] = useState<boolean>(false)
  const [error, setError] = useState('')

  // 모달이 열릴 때마다 초기 상태 설정
  useEffect(() => {
    if (isOpen) {
      setNewNickname(currentNickname)
      setNewLink(currentLink)
      setIsNicknameChecked(false)
      setError('')
      setIsValidateNickname(true)
    }
  }, [isOpen, currentNickname, currentLink])

  const handleCheckNickname = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setNewNickname(name)
    setIsValidateNickname(true)

    const { lengthValid, formatValid } = validateCommonText(name)

    if (!lengthValid) {
      setError(name.trim() ? '닉네임은 16자 이내로 입력해야 합니다.' : '닉네임을 입력하세요.')
      setIsValidateNickname(false)
      setIsNicknameChecked(false)
      return
    }

    if (!formatValid) {
      setError('닉네임은 한글(자음/모음 포함)과 영어, 공백만 포함할 수 있습니다.')
      setIsValidateNickname(false)
      setIsNicknameChecked(false)
      return
    }

    // 닉네임이 변경되었으므로 중복확인 필요
    setIsNicknameChecked(false)
  }

  const handlePortfolioLink = (e: ChangeEvent<HTMLInputElement>) => {
    setNewLink(e.target.value)
    if (currentLink !== e.target.value) {
      if (newNickname === currentNickname) {
        setIsNicknameChecked(true)
      }
      setIsPortfolioLinkChecked(true)
    } else {
      if (isNicknameChecked && newNickname !== currentNickname) {
        setIsPortfolioLinkChecked(true)
        return
      }
      setIsPortfolioLinkChecked(false)
    }
  }

  // 닉네임 중복 확인
  const checkNickname = async () => {
    if (newNickname === currentNickname || !isValidateNickname) return
    try {
      await getCheckNickname({ nickname: newNickname })
      setError('')
      setIsNicknameChecked(true)
      setIsPortfolioLinkChecked(true)
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error.response?.status === 409) {
        setError('이미 사용 중인 닉네임입니다.')
      }
    }
  }

  // 제출 이벤트
  const handleSubmit = () => {
    if (!isNicknameChecked) return

    updateProfile(
      { nickName: newNickname, portfolioUrl: newLink },
      {
        onSuccess: () => {
          handleCloseModal()
        },
      }
    )
  }

  return (
    <Modal isOpen={isOpen} handleCloseModal={handleCloseModal} hasOverlay={false} closeOnOutsideClick={false}>
      <div>
        <p className="semi-20 text-grayscale-50 mb-[40px]">프로필 수정하기</p>

        {/* 닉네임 */}
        <div className="flex items-center mb-6">
          <p className="semi-16 text-grayscale-50 mr-[8px]">닉네임</p>
          <p className="reg-12 text-accent-100">필수</p>
        </div>

        <div className="flex items-stretch gap-[8px]">
          <div className="flex-1">
            <BasicInput
              placeHolder="닉네임을 입력해주세요."
              size="small"
              name="nickname"
              value={newNickname}
              handleChange={handleCheckNickname}
            />
          </div>
          <RoundedSquareButton text="중복 확인" handleClick={checkNickname} disabled={!isValidateNickname} />
        </div>

        {/* 닉네임 부가 설명 */}
        <div className="flex items-center mt-[8px]">
          <CheckAccentIcon className="w-[20px] h-[20px] mr-[2px]" />
          <p className="reg-12 text-accent-100 mr-[16px]">공백 포함 16자 이내</p>
          <CheckAccentIcon className="w-[20px] h-[20px] mr-[2px]" />
          <p className="reg-12 text-accent-100">한글,영어로만 구성</p>
        </div>

        {/* 에러 메시지 */}
        {error && <p className="reg-12 text-red-500 mt-[4px]">{error}</p>}

        {/* 포트폴리오 */}
        <div className="flex items-center mt-[32px] mb-6">
          <p className="semi-16 text-grayscale-50 mr-[8px]">포트폴리오 링크</p>
          <p className="reg-12 text-grayscale-300">선택</p>
        </div>

        {/* 포트폴리오 입력 */}
        <BasicInput
          placeHolder="포트폴리오 링크를 입력해주세요."
          size="small"
          name="portfolioLink"
          value={newLink}
          handleChange={handlePortfolioLink}
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
              theme={isNicknameChecked && isPortfolioLinkChecked ? ButtonTheme.white : ButtonTheme.primary}
              variant={!isNicknameChecked && isPortfolioLinkChecked ? ButtonVariant.default : ButtonVariant.filled}
              size={ButtonSize.xxl}
              text="수정 완료하기"
              fullWidth={true}
              handleClick={handleSubmit}
              disabled={!isNicknameChecked || !isPortfolioLinkChecked}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
