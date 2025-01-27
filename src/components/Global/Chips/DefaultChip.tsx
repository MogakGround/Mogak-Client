import { Color } from "@/constants/Color"
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
        case Color.PRIMARY:
            return "text-primary-100";
        case Color.ACCENT:
            return "text-accent-100";
    }
}

export const getBackground = (color: Color) => {
    switch(color){
        case Color.LIGHT:
            return "bg-grayscale-700";
        case Color.DARK:
            return "bg-grayscale-800";
        case Color.PRIMARY:
            return "bg-primaryT-10";
        case Color.ACCENT:
            return "bg-accentT-10";
    }
}

export const getBorderColor = (color: Color) => {
    switch(color){
        case Color.LIGHT:
            return "border-grayscale-700 ";
        case Color.DARK:
            return "border-grayscale-800 ";
        case Color.PRIMARY:
            return "border-primaryT-20";
        case Color.ACCENT:
            return "border-accentT-20";
    }
}

export const getTextFont = (size: number) => {
    switch(size) {
        case 30:
            return "font-medium text-[12pt] "
        case 38:
            return "font-semibold text-[14pt] "
        case 44:
            return "font-semibold text-[16pt] "
    }
}

export const getDetailTextFont = (size:number) => {
    switch(size) {
        case 30:
            return "font-regular text-[10pt] "
        case 38:
            return "font-regular text-[12pt] "
        case 44:
            return "font-regular text-[12pt] "
    }
}

export const getMoonIcon = (size:number, color: Color) => {
    if(color === Color.LIGHT || color === Color.DARK) {
        switch(size) {
            case 30:
                return <Image src={MoonGraySIcon} alt="회색 소형 달" width={16} height={16}/>
            case 38:
                return <Image src={MoonGrayMIcon} alt="회색 중형 달" width={16} height={16}/>
            case 44:
                return <Image src={MoonGrayLIcon} alt="회색 대형 달" width={20} height={20}/>
        }

    }else if(color === Color.PRIMARY) {
        switch(size) {
            case 30:
                return <Image src={MoonPrimarySIcon} alt="레드색 소형 달" width={16} height={16}/>
            case 38:
                return <Image src={MoonPrimaryMIcon} alt="레드색 중형 달" width={16} height={16}/>
            case 44:
                return <Image src={MoonPrimaryLIcon} alt="레드색 대형 달" width={20} height={20}/>
        }

    }else if(color === Color.ACCENT) {
        switch(size) {
            case 30:
                return <Image src={MoonAccentSIcon} alt="에메랄드색 소형 달" width={16} height={16}/>
            case 38:
                return <Image src={MoonAccentMIcon} alt="에메랄드색 중형 달" width={16} height={16}/>
            case 44:
                return <Image src={MoonAccentLIcon} alt="에메랄드색 대형 달" width={20} height={20}/>
        }
    }
}


/**
 * 
 * @param size: 30, 38, 44 중 하나
 * @param color: LIGHT, DARK, PRIMARY, ACCENT 중 하나
 */
const Chip = ({text, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center px-3 py-[5px] rounded-[4px] ${getBackground(color)} ${getTextFont(size)} ${getTextColor(color)} h-${size}`}>
            {text}
        </div>
    );
}

export default Chip;
  