import { Color } from "@/constants/Color"
import { getTextColor, getTextFont, getBackground, getBorderColor } from "./DefaultChip";

interface Params {
    text: string;
    size: number;
    color: Color;
}

/**
 * 
 * @param size: 30, 38, 44 중 하나
 * @param color: LIGHT, DARK, PRIMARY, ACCENT 중 하나
 */
const Chip = ({text, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center border-2 px-3 py-[5px] rounded-[4px] ${getBackground(color)} ${getBorderColor(color)} ${getTextFont(size)} ${getTextColor(color)} h-${size}`}>
            {text}
        </div>
    );
}

export default Chip;