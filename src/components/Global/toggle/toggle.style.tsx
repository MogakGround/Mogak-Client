import { ToggleTheme } from '@/components/global/toggle/toggle.types'

type ToggleStyles = {
  [key in ToggleTheme]: string
}


export const toggleBaseStyle = 'inline-flex items-center justify-center text-center p-1 rounded-[40px] ';

export const toggleBackgroundStyles: ToggleStyles = {
  [ToggleTheme.LIGHT]: "bg-grayscale-700",
  [ToggleTheme.DARK]: "bg-grayscale-800",
}

export const toggleTextStyle = (theme: ToggleTheme, isOn:boolean) => {
    switch(theme){
        case ToggleTheme.LIGHT:
            return isOn? "bg-white text-grayscale-800" : "bg-grayscale-700 text-grayscale-500";
        case ToggleTheme.DARK:
            return isOn? "bg-white text-grayscale-800" : "bg-grayscale-800 text-grayscale-600";
    }
}