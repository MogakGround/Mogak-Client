import { ChangeEvent } from 'react'
import { IRoomNewForm } from './hooks/useCreateRoom'

import TextToggle from '@/components/global/toggle/TextToggle'
import { ToggleTheme } from '@/components/global/toggle/toggle.types'
import BasicInput from '@/components/global/input/BasicInput'
import ValidationCheck from '@/components/global/form/vaildationCheck'

interface IRoomPrivacyToggleProps {
  roomNewForm: IRoomNewForm
  isPrivate: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  passwordValidations: { lengthValid: boolean; formatValid: boolean }
  handleToggle: () => void
}

export default function RoomPrivacyToggle({
  roomNewForm,
  handleChange,
  passwordValidations,
  isPrivate,
  handleToggle,
}: IRoomPrivacyToggleProps) {
  return (
    <div className="flex flex-col gap-[8px] mt-[40px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <h3 className="semi-16 text-grayscale-50">모각방 공개 여부</h3>
          <span className="reg-12 text-accent-100">필수</span>
        </div>
        <TextToggle theme={ToggleTheme.DARK} isOn={!isPrivate} onToggle={handleToggle} textl="공개" textr="비공개" />
      </div>
      {isPrivate && (
        <div className="flex flex-col gap-[8px]">
          <BasicInput
            placeHolder="입장에 필요한 비밀번호를 입력해주세요. "
            size="medium"
            name="password"
            value={roomNewForm.password}
            handleChange={handleChange}
          />
          <div className="flex items-center gap-[16px]">
            <ValidationCheck isValid={passwordValidations.lengthValid} text="공백 포함 1~16자" />
            <ValidationCheck isValid={passwordValidations.formatValid} text="한글, 영어로만 구성" />
          </div>
        </div>
      )}
    </div>
  )
}
