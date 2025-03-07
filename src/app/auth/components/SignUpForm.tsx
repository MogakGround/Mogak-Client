import { ChangeEvent, useState } from 'react'
import { getCheckNickname } from '@/app/api/user/api'
import NicknameInput from './NicknameInput'
import PortfolioInput from './PortfolioInput'
import SignUpButtonGroup from './SignUpButtonGroup'
import { AxiosError } from 'axios'

interface ISignUpFormProps {
  handleShowIconToast: (text: string, success: boolean) => void
  handleResetToast: () => void
  handleSignUpComplete: () => void // 가입 완료 상태 변경 함수 추가
  signUpForm: { nickname: string; portfolioLink: string }
  setSignUpForm: (signUpForm: { nickname: string; portfolioLink: string }) => void
}

export default function SignUpForm({
  handleShowIconToast,
  handleResetToast,
  handleSignUpComplete,
  signUpForm,
  setSignUpForm,
}: ISignUpFormProps) {
  const [isNicknameChecked, setIsNicknameChecked] = useState(true)
  const [inputValidations, setInputValidations] = useState({ lengthValid: false, formatValid: false })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignUpForm({ ...signUpForm, [name]: value })
    if (name === 'nickname') setIsNicknameChecked(false)
    handleResetToast()
  }

  const checkNicknameAvailability = async () => {
    if (!signUpForm.nickname.trim()) return
    handleResetToast()

    try {
      const res = await getCheckNickname({ nickname: signUpForm.nickname })

      if (res.code === 200) {
        handleShowIconToast('와우 멋지네요! 사용할 수 있는 닉네임이에요', true)
        setIsNicknameChecked(true)
      }
    } catch (error) {
      console.error(error)
      if (error instanceof AxiosError) {
        if (error.response?.data.code === 409) {
          handleShowIconToast(`이미 사용 중인 닉네임이에요.\n다른 멋진 닉네임으로 입력해볼까요?`, false)
          setIsNicknameChecked(false)
        }
      }
    }
  }

  return (
    <>
      <div className="flex flex-col gap-[2px] text-grayscale-50 mb-[40px]">
        <h2 className="semi-20">모각그라운드는 처음이시군요!</h2>
        <p className="text-grayscale-400 reg-14">간단한 정보를 입력하고 가입을 완료해 주세요.</p>
      </div>
      <NicknameInput
        name="nickname"
        value={signUpForm.nickname}
        handleChange={handleChange}
        checkNickname={checkNicknameAvailability}
        inputValidations={inputValidations}
        setInputValidations={setInputValidations}
      />
      <PortfolioInput name="portfolioLink" value={signUpForm.portfolioLink} handleChange={handleChange} />
      <SignUpButtonGroup isNicknameChecked={isNicknameChecked} handleSignUpComplete={handleSignUpComplete} />
    </>
  )
}
