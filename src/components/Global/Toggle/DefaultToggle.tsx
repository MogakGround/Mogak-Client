import { useState } from "react";

import { Color } from "@/constants/Color"

interface Params {
    textl: string;  // 왼왼쪽 버튼 텍스트
    textr: string;  // 오른쪽 버튼 텍스트
    color: Color;
    // 부모 컴포넌트에서 다음과 같은 변수 함수 전달
    /*
    const [isOn, setIsOn] = useState<boolean>(true);
    const handleToggle = () => {
        setIsOn(!isOn); // 현재 상태의 반대로 설정
    };
    */
    isOn: boolean;        // 부모로부터 받은 초기 상태
    onToggle: () => void; // 부모로부터 받은 토글 이벤트
}

export const getTextColor = (isToggled:boolean, color: Color) => {
    switch(color){
        case Color.LIGHT:
            return isToggled? "text-grayscale-800" : "text-grayscale-500";
        case Color.DARK:
            return isToggled? "text-grayscale-800" : "text-grayscale-600";
    }
}

export const getBackground = (color: Color) => {
    switch(color){
        case Color.LIGHT:
            return "bg-grayscale-700";
        case Color.DARK:
            return "bg-grayscale-800";
    }
}

export const getTextBackground = (isToggled:boolean, color: Color) => {
    switch(color){
        case Color.LIGHT:
            return isToggled? "bg-white ": "bg-grayscale-700";
        case Color.DARK:
            return isToggled? "bg-white ": "bg-grayscale-800";
    }
}

/**
 * 
 * @param color: LIGHT, DARK 중 하나
 */
const Chip = ({textl, textr, color, isOn, onToggle}: Params) => {
    
    return (
        <div className={`inline-flex items-center justify-center text-center p-1 rounded-[40px] ${getBackground(color)}`}>
            <div onClick={onToggle} className={`text-[14pt] font-medium rounded-[40px] px-[17px] py-[2px] cursor-pointer ${getTextBackground(isOn, color)} ${getTextColor(isOn, color)}`}>
                {textl}
            </div>
            <div onClick={onToggle} className={`text-[14pt] font-medium rounded-[40px] px-[17px] py-[2px] cursor-pointer ${getTextBackground(!isOn, color)} ${getTextColor(!isOn, color)}`}>
                {textr}
            </div>
        </div>
    );
}

export default Chip;