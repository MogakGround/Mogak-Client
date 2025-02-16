import { ChipSize, IconArrow, IconTextChipProps } from '@/components/global/chip/chip.types'
import {
  chipBaseStyle,
  chipBackgroundStyles,
  chipTextStyles,
  chipTextFont,
  chipDetailTextFont,
  textChipSizeStyles,
} from '@/components/global/chip/chip.style'
import Image from 'next/image'

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
  iconImageSrc="@/assets/svg/moon-accent-l.svg"
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
  iconImageSrc,
  handleClick,
}: IconTextChipProps) => {
  return (
    <div
      className={`${chipBaseStyle} ${chipBackgroundStyles[theme][variant]} ${textChipSizeStyles[size]}`}
      onClick={handleClick}
    >
      {iconArrow === IconArrow.LEFT && (
        <div className="mr-2">
          <Image
            src={iconImageSrc}
            alt={'icon'}
            width={size === ChipSize.lg ? 20 : 16}
            height={size === ChipSize.lg ? 20 : 16}
          />
        </div>
      )}

      <div
        className={`${chipTextStyles[theme][variant]} ${chipTextFont(size)} ${detailText || iconArrow === IconArrow.RIGHT ? '' : 'mr-2'}`}
      >
        {text}
      </div>

      {(detailText || iconArrow === IconArrow.RIGHT) && (
        <div className={`${chipDetailTextFont(size)} text-grayscale-400`}>{detailText}</div>
      )}

      {iconArrow === IconArrow.RIGHT && (
        <div className="ml-2">
          <Image
            src={iconImageSrc}
            alt={'icon'}
            width={size === ChipSize.lg ? 20 : 16}
            height={size === ChipSize.lg ? 20 : 16}
          />
        </div>
      )}
    </div>
  )
}

export default IconTextChip
