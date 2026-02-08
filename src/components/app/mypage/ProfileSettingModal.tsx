import Modal from '@/components/global/modal/Modal'
import CheckAccentIcon from '@/assets/svg/check-accent.svg'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import { ChangeEvent, useEffect, useReducer } from 'react'
import { getCheckNickname } from '@/app/api/user/api'
import { validateCommonText } from '@/utils/validate'
import RoundedSquareButton from '@/components/global/button/RoundedSquareButton'
import BasicInput from '@/components/global/input/BasicInput'
import { useGetMyProfile, useUpdateProfile } from '@/app/mypage/queries'

interface ProfileSettingModalProps {
  isOpen: boolean
  handleCloseModal: () => void
}

// Consolidated form state (reduces 6 useState → 1 useReducer)
interface FormState {
  newNickname: string
  newLink: string
  isValidateNickname: boolean
  isNicknameChecked: boolean
  isPortfolioLinkChecked: boolean
  error: string
}

type FormAction =
  | { type: 'RESET'; payload: { nickname: string; link: string } }
  | { type: 'SET_NICKNAME'; payload: { value: string; isValid: boolean; error: string } }
  | { type: 'SET_LINK'; payload: { value: string; isChecked: boolean; isNicknameChecked?: boolean } }
  | { type: 'NICKNAME_CHECK_SUCCESS' }
  | { type: 'NICKNAME_CHECK_ERROR'; payload: string }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'RESET':
      return {
        newNickname: action.payload.nickname,
        newLink: action.payload.link,
        isValidateNickname: true,
        isNicknameChecked: false,
        isPortfolioLinkChecked: false,
        error: '',
      }
    case 'SET_NICKNAME':
      return {
        ...state,
        newNickname: action.payload.value,
        isValidateNickname: action.payload.isValid,
        isNicknameChecked: false,
        error: action.payload.error,
      }
    case 'SET_LINK':
      return {
        ...state,
        newLink: action.payload.value,
        isPortfolioLinkChecked: action.payload.isChecked,
        isNicknameChecked: action.payload.isNicknameChecked ?? state.isNicknameChecked,
      }
    case 'NICKNAME_CHECK_SUCCESS':
      return {
        ...state,
        error: '',
        isNicknameChecked: true,
        isPortfolioLinkChecked: true,
      }
    case 'NICKNAME_CHECK_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

export default function ProfileSettingModal({ isOpen, handleCloseModal }: ProfileSettingModalProps) {
  const { data: profile } = useGetMyProfile()
  const { mutate: updateProfile } = useUpdateProfile()

  const currentNickname = profile?.nickName ?? ''
  const currentLink = profile?.portfolioUrl ?? ''

  const [formState, dispatch] = useReducer(formReducer, {
    newNickname: currentNickname,
    newLink: currentLink,
    isValidateNickname: true,
    isNicknameChecked: false,
    isPortfolioLinkChecked: false,
    error: '',
  })

  const { newNickname, newLink, isValidateNickname, isNicknameChecked, isPortfolioLinkChecked, error } = formState

  // 모달이 열릴 때마다 초기 상태 설정 (single dispatch instead of 5 setState calls)
  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'RESET', payload: { nickname: currentNickname, link: currentLink } })
    }
  }, [isOpen, currentNickname, currentLink])

  const handleCheckNickname = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const { lengthValid, formatValid } = validateCommonText(name)

    if (!lengthValid) {
      const errorMsg = name.trim() ? '닉네임은 16자 이내로 입력해야 합니다.' : '닉네임을 입력하세요.'
      dispatch({ type: 'SET_NICKNAME', payload: { value: name, isValid: false, error: errorMsg } })
      return
    }

    if (!formatValid) {
      dispatch({
        type: 'SET_NICKNAME',
        payload: { value: name, isValid: false, error: '닉네임은 한글(자음/모음 포함)과 영어, 공백만 포함할 수 있습니다.' },
      })
      return
    }

    // 닉네임이 유효하면 중복확인 필요
    dispatch({ type: 'SET_NICKNAME', payload: { value: name, isValid: true, error: '' } })
  }

  const handlePortfolioLink = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (currentLink !== value) {
      dispatch({
        type: 'SET_LINK',
        payload: {
          value,
          isChecked: true,
          isNicknameChecked: newNickname === currentNickname ? true : undefined,
        },
      })
    } else {
      const shouldCheck = isNicknameChecked && newNickname !== currentNickname
      dispatch({ type: 'SET_LINK', payload: { value, isChecked: shouldCheck } })
    }
  }

  // 닉네임 중복 확인
  const checkNickname = async () => {
    if (newNickname === currentNickname || !isValidateNickname) return
    try {
      await getCheckNickname({ nickname: newNickname })
      dispatch({ type: 'NICKNAME_CHECK_SUCCESS' })
    } catch (err: unknown) {
      const apiError = err as { response?: { status?: number } }
      if (apiError.response?.status === 409) {
        dispatch({ type: 'NICKNAME_CHECK_ERROR', payload: '이미 사용 중인 닉네임입니다.' })
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
