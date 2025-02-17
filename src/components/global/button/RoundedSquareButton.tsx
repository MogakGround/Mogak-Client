import cn from '@/utils/cn'
import { IRoundedSquareButtonProps } from './button.types'

export default function RoundedSquareButton({
  disabled = false,
  text,
  handleClick,
  fullWidth = false,
  type = 'button',
}: IRoundedSquareButtonProps) {
  return (
    <button
      className={cn(
        'px-[20px] py-[12px] bg-grayscale-50 text-grayscale-700 flex items-center justify-center rounded-[8px] semi-16',
        disabled && 'bg-grayscale-600 text-grayscale-400',
        fullWidth && 'w-full'
      )}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
