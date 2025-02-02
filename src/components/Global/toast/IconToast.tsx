import { IconToastProps } from '@/components/global/toast/toast.types'
import { toastBaseStyle, toastBackgroundStyles, toastTextStyles, toastTextFont, toastDetailTextFont, toastSizeStyles, toastXIcon } from '@/components/global/toast/toast.style'

/**
 * 사용 예시
 * 
<IconToast
  theme={ToastTheme.LIGHT} 
  size={ToastSize.lg} 
  text="텍스트" 
  detailText="상세내용" 
  handleClick={toastEvent}
/>
 */
const IconToast = ({theme, size, text, detailText, handleClick}: IconToastProps) => {
    return (
        <div className={`flex w-fit text-start ${toastBaseStyle} ${toastBackgroundStyles[theme]} ${toastSizeStyles[size]}`} onClick={handleClick}>
            {/* 아이콘 */}
            <div className="mr-3">
                {toastXIcon(theme, size)}
            </div>
            
            {/* 텍스트 */}
            <div className={`${toastTextStyles[theme]} ${toastTextFont(size)} `}>
                {text}
            </div>
            {detailText && (
                <div className={`${toastDetailTextFont(size)} text-grayscale-300`}>
                    {detailText}
                </div>
            )}
        </div>
    );
}

export default IconToast;