import BasicInput from '@/components/global/input/BasicInput'
import { IFormInputProps } from './SignUpModal'

export default function PortfolioInput({ name, value, handleChange }: IFormInputProps) {
  return (
    <div className="mb-[60px]">
      <div className="flex items-center gap-[8px] mb-[6px]">
        <h3 className="semi-16 text-grayscale-50">포트폴리오 링크</h3>
        <span className="reg-12 text-grayscale-300">선택</span>
      </div>
      <BasicInput
        placeHolder="Github, Notion 등의 링크를 입력해 주세요."
        size="small"
        name={name}
        value={value}
        handleChange={handleChange}
      />
    </div>
  )
}
