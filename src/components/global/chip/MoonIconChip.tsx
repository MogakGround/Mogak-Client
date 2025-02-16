import { IconArrow, MoonIconChipProps } from '@/components/global/chip/chip.types'
import {
  chipBaseStyle,
  chipBackgroundStyles,
  iconChipSizeStyles,
  chipMoonIcon,
} from '@/components/global/chip/chip.style'

/**
 * 사용 예시
 * 
<MoonIconChip 
  variant={ChipVariant.DEFAULT} 
  theme={ChipTheme.PRIMARY} 
  size={ChipSize.md} 
  handleClick={chipEvent}
/>
 */
const MoonIconChip = ({ variant, theme, size }: MoonIconChipProps) => {
  return (
    <div className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${iconChipSizeStyles[size]}`}>
      {chipMoonIcon(theme, size)}
    </div>
  )
}

export default MoonIconChip
