import { useEffect } from 'react'

import { IRoomNewFormProps } from './hooks/useCreateRoom'
import RoundedSquareButton from '@/components/global/button/RoundedSquareButton'
import BasicInput from '@/components/global/input/BasicInput'
import { validateCommonText } from '@/utils/validate'
import ValidationCheck from '@/components/global/form/vaildationCheck'

interface IRoomNameProps extends IRoomNewFormProps {
  checkRoomName: () => void
  inputValidations: { lengthValid: boolean; formatValid: boolean }
  setInputValidations: (validations: { lengthValid: boolean; formatValid: boolean }) => void
}

export default function RoomName({
  name,
  value,
  handleChange,
  checkRoomName,
  inputValidations,
  setInputValidations,
}: IRoomNameProps) {
  useEffect(() => {
    setInputValidations(validateCommonText(value))
  }, [value, setInputValidations])

  return (
    <>
      <div className="flex items-center gap-[8px] mb-[6px]">
        <h3 className="semi-16 text-grayscale-50">모각방 이름</h3>
        <span className="reg-12 text-accent-100">필수</span>
      </div>
      <div className="flex items-center gap-[8px] mb-[8px]">
        <div className="flex-1">
          <BasicInput
            placeHolder="모각방 이름을 입력해주세요."
            size="small"
            name={name}
            value={value}
            handleChange={handleChange}
          />
        </div>
        <RoundedSquareButton
          text="중복 확인"
          handleClick={checkRoomName}
          disabled={!inputValidations.lengthValid || !inputValidations.formatValid}
        />
      </div>
      <div className="reg-14 mb-[32px]">
        <div className="flex items-center gap-[16px]">
          <ValidationCheck isValid={inputValidations.lengthValid} text="공백 포함 1~16자" />
          <ValidationCheck isValid={inputValidations.formatValid} text="한글, 영어로만 구성" />
        </div>
      </div>
    </>
  )
}
