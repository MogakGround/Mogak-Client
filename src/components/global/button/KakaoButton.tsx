import KAKAO_ICON_SRC from '@/assets/svg/kakao-logo.svg'
import Image from 'next/image'

interface IKakaoButtonProps {
  handleClick: () => void
  disabled?: boolean
}

export default function KakaoButton({ handleClick, disabled }: IKakaoButtonProps) {
  return (
    <button
      className="flex items-center justify-center w-[350px] h-[52px] bg-[#FFE819] rounded-lg"
      onClick={handleClick}
      disabled={disabled || false}
    >
      <Image src={KAKAO_ICON_SRC} alt="kakao" width={24} height={24} />
      <span className="text-[#1A1A25] semi-16 ml-1">카카오로 시작하기</span>
    </button>
  )
}
