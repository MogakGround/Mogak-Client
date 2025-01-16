import { Color } from "@/constants/Color"
import { getTextColor, getTextFont, getBorderColor, getDetailTextFont, getMoonIcon } from "./DefaultChip";

interface Params {
    text: string;
    detailText: string;
    size: number;
    color: Color;
}


const Chip = ({text, detailText, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center border-2 px-3 py-[5px] rounded-[4px] ${getBorderColor(color)} ${getTextFont(size)} h-${size}`}>
            <div className="mr-2">
                {getMoonIcon(size, color)}
            </div>
            <div className={`${getTextFont(size)} ${getTextColor(color)} mr-2`}>
                {text}
            </div>
            <div className={`${getDetailTextFont(size)} text-grayscale-400`}>
                {detailText}
            </div>
        </div>
    );
}

export default Chip;
  