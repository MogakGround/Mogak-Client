import { useEffect, useState } from 'react'
import Image from 'next/image'

import checkDefault from '@/assets/svg/check-default.svg'
import checkAccent from '@/assets/svg/check-accent.svg'
import BasicInput from '@/components/global/input/BasicInput'
import RoundedSquareButton from '@/components/global/button/RoundedSquareButton'
import { IFormInputProps } from './SignUpModal'

interface INicknameInput extends IFormInputProps {
  checkNickname: () => void
}

export default function NicknameInput({ name, value, handleChange, checkNickname }: INicknameInput) {
  const [isValidNickname, setIsValidNickname] = useState(false)

  const validateNickname = (nickname: string) => {
    const trimmed = nickname.trim()
    const nicknameRegex = /^[가-힣a-zA-Z\s]+$/ // 한글, 영어, 공백만 허용 (숫자X, 특수문자X)
    return trimmed.length >= 1 && trimmed.length <= 16 && nicknameRegex.test(trimmed)
  }

  // 닉네임이 변경될 때 유효성 검사 실행
  useEffect(() => {
    setIsValidNickname(validateNickname(value))
  }, [value])

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
        <RoundedSquareButton text="중복 확인" handleClick={checkNickname} disabled={!isValidNickname} />
      </div>
      <div className="reg-14 mb-[32px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Image
              src={value.trim().length >= 1 && value.trim().length <= 16 ? checkAccent : checkDefault}
              width={20}
              height={20}
              alt="check"
            />
            <span
              className={`${value.trim().length >= 1 && value.trim().length <= 16 ? 'text-accent-100' : 'text-grayscale-400'} reg-12`}
            >
              공백 포함 1~16자
            </span>
          </div>
          <div className="flex items-center">
            <Image src={isValidNickname ? checkAccent : checkDefault} width={20} height={20} alt="check" />
            <span className={`${isValidNickname ? 'text-accent-100' : 'text-grayscale-400'} reg-12`}>
              한글, 영어로만 구성
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
