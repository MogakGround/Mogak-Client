import { TextToastProps } from '@/components/global/toast/toast.types'
import { toastBaseStyle, toastBackgroundStyles, toastTextStyles, toastTextFont, toastDetailTextFont, toastSizeStyles } from '@/components/global/toast/toast.style'

/**
 * 사용 예시
 * 
<TextToast
  theme={ToastTheme.LIGHT} 
  size={ToastSize.lg} 
  text="텍스트" 
  detailText="상세내용" 
  handleClick={toastEvent}
/>
 */
const Toast = ({theme, size, text, detailText, handleClick}: TextToastProps) => {
    return (
        <div className={`${toastBaseStyle} ${toastBackgroundStyles[theme]} ${toastSizeStyles[size]} ${detailText? "flex-row w-fit text-start ": "inline-flex text-center"}`} onClick={handleClick}>
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

export default Toast;