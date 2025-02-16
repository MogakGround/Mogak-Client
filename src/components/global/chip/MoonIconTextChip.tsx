import { IconArrow, MoonIconTextChipProps } from '@/components/global/chip/chip.types'
import {
  chipBaseStyle,
  chipBackgroundStyles,
  chipTextStyles,
  chipTextFont,
  chipDetailTextFont,
  textChipSizeStyles,
  chipMoonIcon,
} from '@/components/global/chip/chip.style'

/**
 * 사용 예시
 * 
<MoonIconTextChip 
  variant={ChipVariant.DEFAULT} 
  theme={ChipTheme.PRIMARY} 
  size={ChipSize.md} 
  text="Primary Chip" 
  detailText="Detailed info" 
  iconArrow={IconArrow.LEFT} 
  handleClick={chipEvent}
/>
 */
const MoonIconTextChip = ({
  variant,
  theme,
  size,
  text,
  detailText,
  iconArrow,
  handleClick,
}: MoonIconTextChipProps) => {
  return (
    <div
      className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${textChipSizeStyles[size]}`}
      onClick={handleClick}
    >
      {iconArrow === IconArrow.LEFT && <div className="mr-2">{chipMoonIcon(theme, size)}</div>}

      <div
        className={`${chipTextStyles[theme][variant]} ${chipTextFont(size)} ${detailText || iconArrow === IconArrow.RIGHT ? '' : 'mr-2'}`}
      >
        {text}
      </div>

      {(detailText || iconArrow === IconArrow.RIGHT) && (
        <div className={`${chipDetailTextFont(size)} text-grayscale-400`}>{detailText}</div>
      )}

      {iconArrow === IconArrow.RIGHT && <div className="ml-2">{chipMoonIcon(theme, size)}</div>}
    </div>
  )
}

export default MoonIconTextChip
