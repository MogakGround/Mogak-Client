import { useEffect } from 'react'
import { validateCommonText } from '@/utils/validate'

import { IFormInputProps } from './SignUpModal'
import ValidationCheck from '@/components/global/form/vaildationCheck'
import BasicInput from '@/components/global/input/BasicInput'
import RoundedSquareButton from '@/components/global/button/RoundedSquareButton'

interface INicknameInput extends IFormInputProps {
  inputValidations: { lengthValid: boolean; formatValid: boolean }
  setInputValidations: (validations: { lengthValid: boolean; formatValid: boolean }) => void
  checkNickname: () => void
}

export default function NicknameInput({
  name,
  value,
  handleChange,
  checkNickname,
  inputValidations,
  setInputValidations,
}: INicknameInput) {
  useEffect(() => {
    setInputValidations(validateCommonText(value))
  }, [value, setInputValidations])

  const handleCheckNickname = () => {
    if (inputValidations.lengthValid && inputValidations.formatValid) {
      checkNickname()
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-[8px] mb-[6px]">
        <h3 className="semi-16 text-grayscale-50">닉네임</h3>
        <span className="reg-12 text-accent-100">필수</span>
      </div>
      <div className="flex items-center gap-[8px] mb-[8px]">
        <div className="flex-1">
          <BasicInput
            placeHolder="닉네임을 입력해주세요."
            size="small"
            name={name}
            value={value}
            handleChange={handleChange}
          />
        </div>
        <RoundedSquareButton
          text="중복 확인"
          handleClick={handleCheckNickname}
          disabled={!inputValidations.lengthValid || !inputValidations.formatValid}
        />
      </div>
      <div className="reg-14 mb-[32px]">
        <div className="flex items-center gap-[16px]">
          <ValidationCheck isValid={inputValidations.lengthValid} text="공백 포함 1~16자" />
          <ValidationCheck isValid={inputValidations.formatValid} text="한글, 영어로만 구성" />
        </div>
      </div>
    </div>
  )
}
