import { ChipSize, IconChipProps } from '@/components/global/chip/chip.types'
import {
  chipBaseStyle,
  chipBackgroundStyles,
  iconChipSizeStyles,
  chipMoonIcon,
} from '@/components/global/chip/chip.style'
import Image from 'next/image'

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
const IconChip = ({ variant, theme, size, iconImageSrc, handleClick }: IconChipProps) => {
  return (
    <div
      className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${iconChipSizeStyles[size]}`}
      onClick={handleClick}
    >
      {chipMoonIcon(theme, size)}
      <Image
        src={iconImageSrc}
        alt="icon"
        width={size === ChipSize.sm ? 13 : size === ChipSize.md ? 16 : 20}
        height={size === ChipSize.sm ? 13 : size === ChipSize.md ? 16 : 20}
      />
    </div>
  )
}

export default IconChip
