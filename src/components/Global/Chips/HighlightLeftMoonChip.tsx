import { Color } from "@/constants/Color"
import { getTextColor, getTextFont, getBackground, getBorderColor, getMoonIcon } from "./DefaultChip";


interface Params {
    text: string;
    size: number;
    color: Color;
}


const Chip = ({text, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center border-2 px-3 py-[5px] rounded-[4px] ${getBackground(color)} ${getBorderColor(color)} ${getTextFont(size)} h-${size}`}>
            <div className="mr-2">
                {getMoonIcon(size, color)}
            </div>
            <div className={`${getTextFont(size)} ${getTextColor(color)}`}>
                {text}
            </div>
        </div>
    );
}

export default Chip;