import { ChipVariant, ChipTheme, ChipSize } from '@/components/global/chip/chip.types'

import Image from 'next/image';
import MoonGraySIcon from "@/assets/svg/moon-gray-s.svg"
import MoonGrayMIcon from "@/assets/svg/moon-gray-m.svg"
import MoonGrayLIcon from "@/assets/svg/moon-gray-l.svg"
import MoonPrimarySIcon from "@/assets/svg/moon-primary-s.svg"
import MoonPrimaryMIcon from "@/assets/svg/moon-primary-m.svg"
import MoonPrimaryLIcon from "@/assets/svg/moon-primary-l.svg"
import MoonAccentSIcon from "@/assets/svg/moon-accent-s.svg"
import MoonAccentMIcon from "@/assets/svg/moon-accent-m.svg"
import MoonAccentLIcon from "@/assets/svg/moon-accent-l.svg"


type ChipStyles = {
  [key in ChipTheme]: {
    [variant in ChipVariant]: string
  }
}


export const chipBaseStyle = 'inline-flex items-center justify-center text-center rounded-[4px] ';

export const chipBackgroundStyles: ChipStyles = {
  [ChipTheme.LIGHT]: {
    [ChipVariant.DEFAULT]: 'bg-grayscale-700',
    [ChipVariant.HIGHLIGHT]: 'bg-grayscale-700 border-2 border-grayscale-700 ',
    [ChipVariant.STROKE]: 'border-2 border-grayscale-700 ',
  },
  [ChipTheme.DARK]: {
    [ChipVariant.DEFAULT]: 'bg-grayscale-800',
    [ChipVariant.HIGHLIGHT]: 'bg-grayscale-800 border-2 border-grayscale-800 ',
    [ChipVariant.STROKE]: 'border-2 border-grayscale-800 ',
  },
  [ChipTheme.PRIMARY]: {
    [ChipVariant.DEFAULT]: 'bg-primaryT-10',
    [ChipVariant.HIGHLIGHT]: 'bg-primaryT-10 border-2 border-primaryT-20 ',
    [ChipVariant.STROKE]: 'border-2 border-primaryT-20 ',
  },
  [ChipTheme.ACCENT]: {
    [ChipVariant.DEFAULT]: 'bg-accentT-10',
    [ChipVariant.HIGHLIGHT]: 'bg-accentT-10 border-2 border-accentT-20 ',
    [ChipVariant.STROKE]: 'border-2 border-accentT-20 ',
  },
}

export const chipTextStyles: ChipStyles = {
  [ChipTheme.LIGHT]: {
    [ChipVariant.DEFAULT]: 'text-grayscale-50',
    [ChipVariant.HIGHLIGHT]: 'text-grayscale-50',
    [ChipVariant.STROKE]: 'text-grayscale-50',
  },
  [ChipTheme.DARK]: {
    [ChipVariant.DEFAULT]: 'text-grayscale-50',
    [ChipVariant.HIGHLIGHT]: 'text-grayscale-50',
    [ChipVariant.STROKE]: 'text-grayscale-50',
  },
  [ChipTheme.PRIMARY]: {
    [ChipVariant.DEFAULT]: 'text-primary-100',
    [ChipVariant.HIGHLIGHT]: 'text-primary-100',
    [ChipVariant.STROKE]: 'text-primary-100',
  },
  [ChipTheme.ACCENT]: {
    [ChipVariant.DEFAULT]: 'text-accent-100',
    [ChipVariant.HIGHLIGHT]: 'text-primary-100',
    [ChipVariant.STROKE]: 'text-primary-100',
  },
}

export const textChipSizeStyles = {
  [ChipSize.sm]: 'h-[30px] px-3 py-[5px] ',
  [ChipSize.md]: 'h-[38px] px-3 py-[5px] ',
  [ChipSize.lg]: 'h-[44px] px-3 py-[5px] ',
};

export const iconChipSizeStyles = {
  [ChipSize.sm]: 'h-[30px] p-[5px]',
  [ChipSize.md]: 'h-[38px] p-[8px]',
  [ChipSize.lg]: 'h-[44px] p-[10px]',
};


export const chipTextFont = (size: ChipSize) => {
    switch(size) {
        case ChipSize.sm:
            return "font-medium text-[12pt] "
        case ChipSize.md:
            return "font-semibold text-[14pt] "
        case ChipSize.lg:
            return "font-semibold text-[16pt] "
    }
}

export const chipDetailTextFont = (size: ChipSize) => {
    switch(size) {
        case ChipSize.sm:
            return "font-regular text-[10pt] "
        case ChipSize.md:
            return "font-regular text-[12pt] "
        case ChipSize.lg:
            return "font-regular text-[12pt] "
    }
}


const chipMoonIconStyles = {
  [ChipTheme.LIGHT]: {
    [ChipSize.sm]: MoonGraySIcon,
    [ChipSize.md]: MoonGrayMIcon,
    [ChipSize.lg]: MoonGrayLIcon,
  },
  [ChipTheme.DARK]: {
    [ChipSize.sm]: MoonGraySIcon,
    [ChipSize.md]: MoonGrayMIcon,
    [ChipSize.lg]: MoonGrayLIcon,
  },
  [ChipTheme.PRIMARY]: {
    [ChipSize.sm]: MoonPrimarySIcon,
    [ChipSize.md]: MoonPrimaryMIcon,
    [ChipSize.lg]: MoonPrimaryLIcon,
  },
  [ChipTheme.ACCENT]: {
    [ChipSize.sm]: MoonAccentSIcon,
    [ChipSize.md]: MoonAccentMIcon,
    [ChipSize.lg]: MoonAccentLIcon,
  },
};

export const chipMoonIcon = (theme: ChipTheme, size: ChipSize) => {
  const iconSrc = chipMoonIconStyles[theme]?.[size];

  if (!iconSrc) {
    return null;
  }

  const altText = `${theme} ${size} moon icon`;

  return <Image src={iconSrc} alt={altText} width={size === ChipSize.lg ? 20 : 16} height={size === ChipSize.lg ? 20 : 16} />;
};

/*
export const chipMoonIcon = (size: ChipSize, color: ChipTheme) => {
  if (color === ChipTheme.LIGHT || color === ChipTheme.DARK) {
    switch (size) {
      case ChipSize.sm:
        return <Image src={MoonGraySIcon} alt="회색 소형 달" width={16} height={16} />;
      case ChipSize.md:
        return <Image src={MoonGrayMIcon} alt="회색 중형 달" width={16} height={16} />;
      case ChipSize.lg:
        return <Image src={MoonGrayLIcon} alt="회색 대형 달" width={20} height={20} />;
    }
  } else if (color === ChipTheme.PRIMARY) {
    switch (size) {
      case ChipSize.sm:
        return <Image src={MoonPrimarySIcon} alt="레드색 소형 달" width={16} height={16} />;
      case ChipSize.md:
        return <Image src={MoonPrimaryMIcon} alt="레드색 중형 달" width={16} height={16} />;
      case ChipSize.lg:
        return <Image src={MoonPrimaryLIcon} alt="레드색 대형 달" width={20} height={20} />;
    }
  } else if (color === ChipTheme.ACCENT) {
    switch (size) {
      case ChipSize.sm:
        return <Image src={MoonAccentSIcon} alt="에메랄드색 소형 달" width={16} height={16} />;
      case ChipSize.md:
        return <Image src={MoonAccentMIcon} alt="에메랄드색 중형 달" width={16} height={16} />;
      case ChipSize.lg:
        return <Image src={MoonAccentLIcon} alt="에메랄드색 대형 달" width={20} height={20} />;
    }
  }
  return null;
};
*/