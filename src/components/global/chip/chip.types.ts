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

// 디테일 텍스트 방향
export enum DetailTextArrow {
  LEFT,
  RIGHT,
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
  handleClick: () => void
}

// 텍스트 칩
export interface TextChipProps extends ChipProps {
  text: string
  detailText?: string
  detailTextArrow?: DetailTextArrow
}

// 아이콘 텍스트 칩
export interface MoonIconTextChipProps extends TextChipProps {
  iconArrow: IconArrow
}

export interface IconTextChipProps extends MoonIconTextChipProps {
  iconArrow: IconArrow
  iconImageSrc: string
}

// 아이콘 칩
export interface MoonIconChipProps extends ChipProps {}
