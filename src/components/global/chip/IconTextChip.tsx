import { ChipSize, IconArrow, IconTextChipProps } from '@/components/global/chip/chip.types'
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
<IconTextChip
  variant={ChipVariant.DEFAULT}
  theme={ChipTheme.PRIMARY}
  size={ChipSize.md}
  text="Primary Chip"
  detailText="Detailed info"
  iconArrow={IconArrow.LEFT}
  iconImageSrc={SomeIcon}
  handleClick={chipEvent}
/>
 */
const IconTextChip = ({
  variant,
  theme,
  size,
  text,
  detailText,
  iconArrow,
  iconImageSrc: IconImage,
  handleClick,
}: IconTextChipProps) => {
  const iconSize = size === ChipSize.lg ? 20 : 16

  return (
    <div
      className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${textChipSizeStyles[size]}`}
      onClick={handleClick}
    >
      {iconArrow === IconArrow.LEFT && (
        <div className="mr-[8px]">
          <IconImage width={iconSize} height={iconSize} />
        </div>
      )}

      <div
        className={`${chipTextStyles[theme][variant]} ${chipTextFont(size)} ${detailText || iconArrow === IconArrow.RIGHT ? (size === ChipSize.sm ? 'mr-[6px]' : 'mr-[8px]') : ''}`}
      >
        {text}
      </div>

      {(detailText || iconArrow === IconArrow.RIGHT) && (
        <div className={`${chipDetailTextFont(size)} text-grayscale-400`}>{detailText}</div>
      )}

      {iconArrow === IconArrow.RIGHT && (
        <div className="ml-[8px]">
          <IconImage width={iconSize} height={iconSize} />
        </div>
      )}
    </div>
  )
}

export default IconTextChip
