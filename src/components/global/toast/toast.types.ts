// 토스트 모양 종류
/*
export enum ToastVariant {
  DEFAULT,
}
*/

// 배경색
export enum ToastTheme {
  LIGHT,
  DARK,
}

// 크기
export enum ToastSize {
  //xs = 'xs',
  sm = 46,
  md = 50,
  //lg = 'lg',
  //xl = 'xl',
  //xxl = 'xxl',
}

// 공통 프롭스
interface ToastProps {
  //variant: ToastVariant
  theme: ToastTheme
  size: ToastSize
  handleClick: () => void
}

// 텍스트 토스트
export interface TextToastProps extends ToastProps {
  text: string
  detailText?: string
}

// 아이콘 토스트
export interface IconToastProps extends TextToastProps {}
