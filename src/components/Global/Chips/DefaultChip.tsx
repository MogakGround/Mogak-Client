import { Color } from "@/constants/Color"
import Image from 'next/image';
import MoonGraySIcon from "@/assets/svg/moon-gray-s.svg"
import MoonGrayMIcon from "@/assets/svg/moon-gray-m.svg"
import MoonGrayLIcon from "@/assets/svg/moon-gray-l.svg"
import MoonRedSIcon from "@/assets/svg/moon-red-s.svg"
import MoonRedMIcon from "@/assets/svg/moon-red-m.svg"
import MoonRedLIcon from "@/assets/svg/moon-red-l.svg"
import MoonEmeraldSIcon from "@/assets/svg/moon-emerald-s.svg"
import MoonEmeraldMIcon from "@/assets/svg/moon-emerald-m.svg"
import MoonEmeraldLIcon from "@/assets/svg/moon-emerald-l.svg"

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
                return <Image src={MoonRedSIcon} alt="레드색 소형 달" width={16} height={16}/>
            case 38:
                return <Image src={MoonRedMIcon} alt="레드색 중형 달" width={16} height={16}/>
            case 44:
                return <Image src={MoonRedLIcon} alt="레드색 대형 달" width={20} height={20}/>
        }

    }else if(color === Color.ACCENT) {
        switch(size) {
            case 30:
                return <Image src={MoonEmeraldSIcon} alt="에메랄드색 소형 달" width={16} height={16}/>
            case 38:
                return <Image src={MoonEmeraldMIcon} alt="에메랄드색 중형 달" width={16} height={16}/>
            case 44:
                return <Image src={MoonEmeraldLIcon} alt="에메랄드색 대형 달" width={20} height={20}/>
        }
    }
}


const Chip = ({text, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center px-3 py-[5px] rounded-[4px] ${getTextFont(size)} h-${size} ${getBackground(color)} ${getTextColor(color)}`}>
            {text}
        </div>
    );
}

export default Chip;
  