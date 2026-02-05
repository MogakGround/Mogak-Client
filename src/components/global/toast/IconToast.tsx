import { IconToastProps } from '@/components/global/toast/toast.types'
import {
  iconToastBaseStyle,
  toastBackgroundStyles,
  toastTextStyles,
  toastTextFont,
  toastDetailTextFont,
  toastXIcon,
} from '@/components/global/toast/toast.style'
import GoodIcon from '@/assets/svg/good-accent.svg'
/**
 * 사용 예시
 * 🚨주의: 텍스트를 ""가 아닌 {``} 백틱으로 전달해야 whitespace-pre-wrap가 먹힘
 * 
<IconToast
  theme={ToastTheme.LIGHT} 
  size={ToastSize.sm} 
  text={`첫째줄텍스트\n둘째줄텍스트`}
  detailText={`첫째줄상세내용\n둘째줄상세내용`} 
  handleClick={toastEvent}
/>
 */
const IconToast = ({ theme, size, text, detailText, success = false, handleClick }: IconToastProps) => {
  return (
    <div
      className={`
        ${iconToastBaseStyle} 
        ${toastBackgroundStyles[theme]}`}
      onClick={handleClick}
    >
      {/* 아이콘 */}
      <div className="mr-[12px]">
        {success ? <GoodIcon width={20} height={20} /> : toastXIcon(theme, size)}
      </div>

      {/* 텍스트 */}
      <div className={`${detailText ? '' : 'inline-flex '}`}>
        <p className={`whitespace-pre-wrap ${toastTextStyles[theme]} ${toastTextFont(size, detailText)} `}>{text}</p>
        {detailText && (
          <p className={`whitespace-pre-wrap ${toastDetailTextFont(size)} text-grayscale-300`}>{detailText}</p>
        )}
      </div>
    </div>
  )
}

export default IconToast
