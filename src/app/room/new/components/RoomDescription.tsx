import TextField from '@/components/global/textField/TextField'
import { IRoomNewFormProps } from './hooks/useCreateRoom'

export default function RoomDescription({ name, value, handleChange }: IRoomNewFormProps) {
  return (
    <>
      <div className="flex items-center gap-[8px] mb-[6px]">
        <h3 className="semi-16 text-grayscale-50">모각방 설명</h3>
        <span className="reg-12 text-grayscale-300">선택</span>
      </div>
      <div className="h-[172px] mb-[40px]">
        <TextField
          name={name}
          placeholder={`모각방에 대한 간단한 설명을 입력해주세요.\n(ex: 앱 서비스 메이커들의 방)`}
          value={value}
          handleChange={handleChange}
          maxLength={100}
        />
      </div>
    </>
  )
}
