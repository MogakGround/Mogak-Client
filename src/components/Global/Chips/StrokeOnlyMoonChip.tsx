import { Color } from "@/constants/Color"
import { getBorderColor, getMoonIcon } from "./DefaultChip";


interface Params {
    text: string;
    size: number;
    color: Color;
}


const Chip = ({size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center border-2 p-[${size===30?5: size===38?8: 10}px] rounded-[4px] ${getBorderColor(color)} h-${size}`}>
            {getMoonIcon(size, color)}
        </div>
    );
}

export default Chip;