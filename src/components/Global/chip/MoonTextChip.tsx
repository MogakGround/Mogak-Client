import { IconArrow, MoonTextChipProps } from '@/components/global/chip/chip.types'
import { chipBaseStyle, chipBackgroundStyles, chipTextStyles, textChipSizeStyles, chipTextFont, chipDetailTextFont, chipMoonIcon } from '@/components/global/chip/chip.style'

/**
 * 사용 예시
 * 
<MoonTextChip 
  variant={ChipVariant.DEFAULT} 
  theme={ChipTheme.PRIMARY} 
  size={ChipSize.md} 
  text="Primary Chip" 
  detailText="Detailed info" 
  iconArrow={IconArrow.LEFT} 
  handleClick={chipEvent}
/>
 */
const Chip = ({variant, theme, size, text, detailText, iconArrow, handleClick}: MoonTextChipProps) => {
    return (
        <div className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${textChipSizeStyles[size]}`} onClick={handleClick}>
            {iconArrow === IconArrow.LEFT && (
                <div className="mr-2">
                {chipMoonIcon(size, theme)}
                </div>
            )}
            
            <div className={`${chipTextStyles[theme][variant]} ${chipTextFont(size)} ${detailText || iconArrow === IconArrow.RIGHT ? '' : 'mr-2'}`}>
                {text}
            </div>

            {(detailText || iconArrow === IconArrow.RIGHT) && (
                <div className={`${chipDetailTextFont(size)} text-grayscale-400`}>
                    {detailText}
                </div>
            )}

            {iconArrow === IconArrow.RIGHT && (
                <div className="ml-2">
                    {chipMoonIcon(size, theme)}
                </div>
            )}
        </div>
    );
}

export default Chip;