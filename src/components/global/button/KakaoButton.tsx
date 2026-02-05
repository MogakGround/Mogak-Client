import KakaoIcon from '@/assets/svg/kakao-logo.svg'

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
      <KakaoIcon width={24} height={24} />
      <span className="text-[#1A1A25] semi-16 ml-1">카카오로 시작하기</span>
    </button>
  )
}
