import { Color } from "@/constants/Color"
import { getBackground, getTextColor, getTextFont, getXIcon } from "@/components/Global/Toast/DefaultToast"

interface Params {
    text: string;
    description: string;
    size: number;
    color: Color;
}


/**
 * 
 * @param h: 46, 50 중 하나
 * @param color: LIGHT, DARK 중 하나
 */
const Toast = ({text, size, color}: Params) => {
    return (
        <div className={`flex w-fit items-center justify-center text-start px-3 py-4 rounded-[12px] ${getBackground(color)} h-${size}`}>
            {/* 아이콘 */}
            <div className="mr-3">
                {getXIcon(size, color)}
            </div>

            {/* 텍스트 */}
            <div className={`${getTextFont(size)} ${getTextColor(color)} `}>
                {text}
            </div>
        </div>
    );
}

export default Toast;