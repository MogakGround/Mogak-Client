import { Color } from "@/constants/Color"
import { getBackground, getMoonIcon } from "./DefaultChip";


interface Params {
    text: string;
    size: number;
    color: Color;
}


const Chip = ({size, color}: Params) => {
    return (
        <div className={`inline-flex items-center justify-center text-center p-[${size===30?5: size===38?8: 10}px] rounded-[4px] ${getBackground(color)} h-${size}`}>
            {getMoonIcon(size, color)}
        </div>
    );
}

export default Chip;
  