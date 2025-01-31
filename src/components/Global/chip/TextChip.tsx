import { TextChipProps } from '@/components/global/chip/chip.types'
import { chipBaseStyle, chipBackgroundStyles, chipTextStyles, textChipSizeStyles, chipTextFont, chipDetailTextFont, chipMoonIcon } from '@/components/global/chip/chip.style'

/**
 * 사용 예시
 * 
<TextChip 
  variant={ChipVariant.DEFAULT} 
  theme={ChipTheme.PRIMARY} 
  size={ChipSize.md} 
  text="Primary Chip" 
  detailText="Detailed info" 
  handleClick={chipEvent}
/>
 */
const Chip = ({variant, theme, size, text, detailText, handleClick}: TextChipProps) => {
    return (
        <div className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${textChipSizeStyles[size]}`} onClick={handleClick}>
            <div className={`${chipTextStyles[theme][variant]} ${chipTextFont(size)} ${detailText ? '' : 'mr-2'}`}>
                {text}
            </div>
            {detailText && (
                <div className={`${chipDetailTextFont(size)} text-grayscale-400`}>
                {detailText}
                </div>
            )}
        </div>
    );
}

export default Chip;