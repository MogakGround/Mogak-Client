import { ChipSize, IconChipProps } from '@/components/global/chip/chip.types'
import {
  chipBaseStyle,
  chipBackgroundStyles,
  iconChipSizeStyles,
  chipMoonIcon,
} from '@/components/global/chip/chip.style'

/**
 * 사용 예시
 * 
<IconChip 
  variant={ChipVariant.DEFAULT} 
  theme={ChipTheme.PRIMARY} 
  size={ChipSize.md} 
  handleClick={chipEvent}
/>
 */
const IconChip = ({ variant, theme, size, iconImageSrc: IconImage, handleClick }: IconChipProps) => {
  const iconSize = size === ChipSize.sm ? 13 : size === ChipSize.md ? 16 : 20
  return (
    <div
      className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${iconChipSizeStyles[size]}`}
      onClick={handleClick}
    >
      <IconImage width={iconSize} height={iconSize} />
    </div>
  )
}

export default IconChip
