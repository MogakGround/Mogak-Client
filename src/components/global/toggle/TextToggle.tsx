import { TextToggleProps } from '@/components/global/toggle/toggle.types'
import { toggleBaseStyle, toggleBackgroundStyles, toggleTextStyle } from '@/components/global/toggle/toggle.style'
import cn from '@/utils/cn'

/**
 * 사용 예시
 * 
<TextToggle
  theme={ToggleTheme.LIGHT} 
  isOn={isOn}
  onToggle={handleToggle}
  textl="On" 
  textr="Off" 
/>
 */

const TextToggle = ({ theme, isOn, onToggle, textl, textr, className }: TextToggleProps) => {
  return (
    <div className={`${toggleBaseStyle} ${toggleBackgroundStyles[theme]}`}>
      <div
        onClick={onToggle}
        className={cn(
          'med-14 rounded-[40px] px-[17px] py-[2px] cursor-pointer',
          className,
          toggleTextStyle(theme, isOn)
        )}
      >
        {textl}
      </div>
      <div
        onClick={onToggle}
        className={cn(
          'med-14 rounded-[40px] px-[17px] py-[2px] cursor-pointer',
          className,
          toggleTextStyle(theme, !isOn)
        )}
      >
        {textr}
      </div>
    </div>
  )
}

export default TextToggle
