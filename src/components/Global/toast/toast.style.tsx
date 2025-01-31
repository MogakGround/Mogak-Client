import { ToastTheme, ToastSize } from '@/components/global/toast/toast.types'

import Image from 'next/image';
import XDarkIcon from "@/assets/svg/x-primary-dark.svg"
import XLightIcon from "@/assets/svg/x-primary-light.svg"


type ToastStyles = {
  [key in ToastTheme]: string
}


export const toastBaseStyle = 'items-center justify-center px-3 py-4 rounded-[12px] ';
export const iconToastBaseStyle = 'flex w-fit items-center justify-center text-start px-3 py-4 rounded-[12px] ';

export const toastBackgroundStyles: ToastStyles = {
  [ToastTheme.LIGHT]: "bg-grayscale-700",
  [ToastTheme.DARK]: "bg-grayscale-800",
}

export const toastTextStyles: ToastStyles = {
  [ToastTheme.LIGHT]: "text-grayscale-50",
  [ToastTheme.DARK]: "text-grayscale-50",
}

export const toastSizeStyles = {
  [ToastSize.lg]: 'h-[46px] ',
  [ToastSize.xl]: 'h-[50px] ',
};


export const toastTextFont = (size: ToastSize) => {
    switch(size) {
        case ToastSize.lg:
            return "font-medium text-[14pt] "
        case ToastSize.xl:
            return "font-medium text-[16pt] "
    }
}

export const toastDetailTextFont = (size: ToastSize) => {
  switch(size) {
      case ToastSize.lg:
          return "font-regular text-[12pt] "
      case ToastSize.xl:
          return "font-regular text-[14pt] "
  }
}


const toastXIconStyles = {
  [ToastTheme.LIGHT]: {
    [ToastSize.lg]: XLightIcon,
    [ToastSize.xl]: XLightIcon,
  },
  [ToastTheme.DARK]: {
    [ToastSize.lg]: XDarkIcon,
    [ToastSize.xl]: XDarkIcon,
  },
};

export const toastXIcon = (theme: ToastTheme, size: ToastSize) => {
  const iconSrc = toastXIconStyles[theme]?.[size];

  if (!iconSrc) {
    return null;
  }

  const altText = `${theme} ${size} X icon`;

  return <Image src={iconSrc} alt={altText} width={20} height={20} />;
};
