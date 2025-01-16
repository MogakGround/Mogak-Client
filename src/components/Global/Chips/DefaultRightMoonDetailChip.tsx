import { Color } from "@/constants/Color"
import { getTextColor, getTextFont, getBackground, getDetailTextFont, getMoonIcon } from "./DefaultChip";

interface Params {
    text: string;
    detailText: string;
    size: number;
    color: Color;
}


const Chip = ({text, detailText, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center px-3 py-[5px] rounded-[4px] ${getBackground(color)} ${getTextFont(size)} h-${size}`}>
            <div className={`${getTextFont(size)} ${getTextColor(color)} mr-2`}>
                {text}
            </div>
            <div className={`${getDetailTextFont(size)} text-grayscale-400 mr-2`}>
                {detailText}
            </div>
            {getMoonIcon(size, color)}
        </div>
    );
}

export default Chip;
  