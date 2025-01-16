import { Color } from "@/constants/Color"
import Image from 'next/image';
import MoonSIcon from "@/assets/svg/moon-s.svg"
import MoonMIcon from "@/assets/svg/moon-m.svg"
import MoonLIcon from "@/assets/svg/moon-l.svg"

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

export const getMoonIcon = (size:number) => {
    switch(size) {
        case 30:
            return <Image src={MoonSIcon} alt="달 아이콘" width={16} height={16}/>
        case 38:
            return <Image src={MoonMIcon} alt="달 아이콘" width={16} height={16}/>
        case 44:
            return <Image src={MoonLIcon} alt="달 아이콘" width={20} height={20}/>
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
  