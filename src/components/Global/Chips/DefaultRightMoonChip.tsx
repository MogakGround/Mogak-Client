import { Color } from "@/constants/Color"
import { getTextColor, getTextFont, getBackground, getMoonIcon } from "./DefaultChip";


interface Params {
    text: string;
    size: number;
    color: Color;
}


const Chip = ({text, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center px-3 py-[5px] rounded-[4px] ${getBackground(color)} ${getTextFont(size)} h-${size}`}>
            <div className={`${getTextFont(size)} ${getTextColor(color)} mr-2`}>
                {text}
            </div>
            {getMoonIcon(size, color)}
        </div>
    );
}

export default Chip;
  