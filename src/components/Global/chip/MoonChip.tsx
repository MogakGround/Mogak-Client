import { IconArrow, MoonChipProps } from '@/components/global/chip/chip.types'
import { chipBaseStyle, chipBackgroundStyles, chipTextStyles, iconChipSizeStyles, chipTextFont, chipDetailTextFont, chipMoonIcon } from '@/components/global/chip/chip.style'

/**
 * 사용 예시
 * 
<MoonChip 
  variant={ChipVariant.DEFAULT} 
  theme={ChipTheme.PRIMARY} 
  size={ChipSize.md} 
  handleClick={chipEvent}
/>
 */
const Chip = ({variant, theme, size}: MoonChipProps) => {
    return (
        <div className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${iconChipSizeStyles[size]}`}>
            {chipMoonIcon(size, theme)}
        </div>
    );
}

export default Chip;