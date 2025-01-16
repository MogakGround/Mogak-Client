import { Color } from "@/constants/Color"
import { getTextColor, getTextFont, getBorderColor } from "./DefaultChip";

interface Params {
    text: string;
    size: number;
    color: Color;
}

const Chip = ({text, size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center border-2 px-3 py-[5px] rounded-[4px] ${getBorderColor(color)} ${getTextFont(size)} ${getTextColor(color)} h-${size}`}>
            {text}
        </div>
    );
}

export default Chip;
  