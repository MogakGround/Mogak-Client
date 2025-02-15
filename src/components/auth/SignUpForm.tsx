import { ChangeEvent, useState } from 'react'
import NicknameInput from './NicknameInput'
import PortfolioInput from './PortfolioInput'
import SignUpButtonGroup from './SignUpButtonGroup'

interface ISignUpFormProps {
  showToastMessage: (message: string) => void
  handleSignUpComplete: () => void // 가입 완료 상태 변경 함수 추가
}

export default function SignUpForm({ showToastMessage, handleSignUpComplete }: ISignUpFormProps) {
  const [signUpForm, setSignUpForm] = useState({ nickname: '', portfolioLink: '' })
  const [isNicknameChecked, setIsNicknameChecked] = useState(true)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignUpForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'nickname') setIsNicknameChecked(false)
  }

  const checkNicknameAvailability = async () => {
    if (!signUpForm.nickname.trim()) return
    const isAvailable = true // TODO: 실제 API 요청

    if (isAvailable) {
      showToastMessage('사용할 수 있는 닉네임이에요!')
      setIsNicknameChecked(true)
    } else {
      showToastMessage(`이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해주세요.`)
      setIsNicknameChecked(false)
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
      />
      <PortfolioInput name="portfolioLink" value={signUpForm.portfolioLink} handleChange={handleChange} />
      <SignUpButtonGroup isNicknameChecked={isNicknameChecked} handleSignUpComplete={handleSignUpComplete} />
    </>
  )
}
