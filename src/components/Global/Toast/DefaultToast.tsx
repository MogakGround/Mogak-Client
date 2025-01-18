import { Color } from "@/constants/Color"
import Image from 'next/image';
import XDarkIcon from "@/assets/svg/x-red-dark.svg"
import XLightIcon from "@/assets/svg/x-red-light.svg"

interface Params {
    text: string;
    size: number;
    color: Color;
}

export const getTextColor = (color: Color) => {
    switch(color){
        case Color.LIGHT:
            return "text-grayscale-50";
        case Color.DARK:
            return "text-grayscale-50";
    }
}

export const getBackground = (color: Color) => {
    switch(color){
        case Color.LIGHT:
            return "bg-grayscale-700";
        case Color.DARK:
            return "bg-grayscale-800";
    }
}

export const getTextFont = (size: number) => {
    switch(size) {
        case 46:
            return "font-medium text-[14pt] "
        case 50:
            return "font-medium text-[16pt] "
    }
}

export const getDescriptionTextFont = (size:number) => {
    switch(size) {
        case 46:
            return "font-regular text-[12pt] "
        case 50:
            return "font-regular text-[14pt] "
    }
}

export const getXIcon = (size:number, color: Color) => {
    if(color === Color.LIGHT) {
        switch(size) {
            case 46:
                return <Image src={XLightIcon} alt="레드-연회색 소형 X" width={20} height={20}/>
            case 50:
                return <Image src={XLightIcon} alt="레드-연회색 중형 X" width={20} height={20}/>
        }

    }else if(color === Color.DARK) {
        switch(size) {
            case 46:
                return <Image src={XDarkIcon} alt="레드-진회색 소형 X" width={20} height={20}/>
            case 50:
                return <Image src={XDarkIcon} alt="레드-진회색 중형 X" width={20} height={20}/>
        }

    }
}

/**
 * 
 * @param h: 46 또는 50
 */
const Toast = ({text, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center px-3 py-4 rounded-[12px] ${getBackground(color)} h-${size}`}>
            <div className={`${getTextFont(size)} ${getTextColor(color)} `}>
                {text}
            </div>
        </div>
    );
}

export default Toast;