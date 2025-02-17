// 칩 모양 종류
export enum ChipVariant {
  DEFAULT,
  HIGHLIGHT,
  STROKE,
}

// 배경색
export enum ChipTheme {
  LIGHT,
  DARK,
  PRIMARY,
  ACCENT,
}

// 크기
export enum ChipSize {
  //xs = 'xs',
  sm = 30,
  md = 38,
  lg = 44,
  //xl = 'xl',
  //xxl = 'xxl',
}

// 아이콘 방향
export enum IconArrow {
  LEFT,
  RIGHT,
}

// 공통 프롭스
interface ChipProps {
  variant: ChipVariant
  theme: ChipTheme
  size: ChipSize
  handleClick?: () => void
}

// 텍스트 칩
export interface TextChipProps extends ChipProps {
  text: string
  detailText?: string
}

// 아이콘 텍스트 칩
export interface MoonTextChipProps extends TextChipProps {
  iconArrow: IconArrow
}

// 아이콘 칩
export interface MoonChipProps extends ChipProps {}
