import { TextToastProps } from '@/components/global/toast/toast.types'
import {
  toastBaseStyle,
  toastBackgroundStyles,
  toastTextStyles,
  toastTextFont,
  toastDetailTextFont,
} from '@/components/global/toast/toast.style'

/**
 * 사용 예시
 * 🚨주의: 텍스트를 ""가 아닌 {``} 백틱으로 전달해야 whitespace-pre-wrap가 먹힘
 * 
<TextToast
  theme={ToastTheme.LIGHT} 
  size={ToastSize.sm} 
  text={`첫째줄텍스트\n둘째줄텍스트`}
  detailText={`첫째줄상세내용\n둘째줄상세내용`} 
  handleClick={toastEvent}
/>
 */
const TextToast = ({ theme, size, text, detailText, handleClick }: TextToastProps) => {
  return (
    <div
      className={`
        ${detailText ? 'flex-row w-fit' : 'inline-flex'}
        ${toastBaseStyle} 
        ${toastBackgroundStyles[theme]}`}
      onClick={handleClick}
    >
      <div className={`whitespace-pre-wrap ${toastTextStyles[theme]} ${toastTextFont(size, detailText)} `}>{text}</div>
      {detailText && (
        <div className={`whitespace-pre-wrap ${toastDetailTextFont(size)} text-grayscale-300`}>{detailText}</div>
      )}
    </div>
  )
}

export default TextToast
