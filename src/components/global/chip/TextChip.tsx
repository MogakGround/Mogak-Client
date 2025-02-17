import { ChipSize, DetailTextArrow, TextChipProps } from '@/components/global/chip/chip.types'
import {
  chipBaseStyle,
  chipBackgroundStyles,
  chipTextStyles,
  chipTextFont,
  chipDetailTextFont,
  textChipSizeStyles,
} from '@/components/global/chip/chip.style'

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
const TextChip = ({
  variant,
  theme,
  size,
  text,
  detailText,
  detailTextArrow = DetailTextArrow.RIGHT,
  handleClick,
}: TextChipProps) => {
  return (
    <div
      className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${textChipSizeStyles[size]}`}
      onClick={handleClick}
    >
      {detailText && detailTextArrow === DetailTextArrow.LEFT && (
        <div className={`${chipDetailTextFont(size)} text-grayscale-400`}>{detailText}</div>
      )}
      <div
        className={`${chipTextStyles[theme][variant]} ${chipTextFont(size)} 
      ${detailText && detailTextArrow === DetailTextArrow.LEFT ? (size === ChipSize.sm ? 'ml-[6px]' : 'ml-[8px]') : size === ChipSize.sm ? 'mr-[6px]' : 'mr-[8px]'}`}
      >
        {text}
      </div>
      {detailText && detailTextArrow === DetailTextArrow.RIGHT && (
        <div className={`${chipDetailTextFont(size)} text-grayscale-400`}>{detailText}</div>
      )}
    </div>
  )
}

export default TextChip
