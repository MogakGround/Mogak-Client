import { Color } from "@/constants/Color"
import { getBackground, getTextColor, getTextFont, getDescriptionTextFont, getXIcon } from "@/components/Global/Toast/DefaultToast"

interface Params {
    text: string;
    description: string;
    size: number;
    color: Color;
}


/**
 * 
 * @param h: 46 또는 50
 */
const Toast = ({text, description, size, color}: Params) => {
    return (
        <div className={`flex w-fit items-center justify-center text-start px-3 py-4 rounded-[12px] ${getBackground(color)} h-${size}`}>
            {/* 아이콘 */}
            <div className="mr-3">
                {getXIcon(size, color)}
            </div>

            {/* 텍스트 */}
            <div className="flex-row">
                <div className={`${getTextFont(size)} ${getTextColor(color)} `}>
                    {text}
                </div>
                <div className={`${getDescriptionTextFont(size)} text-grayscale-300`}>
                    {description}
                </div>
            </div>
        </div>
    );
}

export default Toast;