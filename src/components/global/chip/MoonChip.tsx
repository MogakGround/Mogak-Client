import { MoonChipProps } from '@/components/global/chip/chip.types'
import {
  chipBaseStyle,
  chipBackgroundStyles,
  iconChipSizeStyles,
  chipMoonIcon,
} from '@/components/global/chip/chip.style'

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
const MoonChip = ({ variant, theme, size }: MoonChipProps) => {
  return (
    <div className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${iconChipSizeStyles[size]}`}>
      {chipMoonIcon(theme, size)}
    </div>
  )
}

export default MoonChip
