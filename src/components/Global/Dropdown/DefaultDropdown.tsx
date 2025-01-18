"use client"
import React, { useState } from 'react';
import DArrowWhiteIcon from "@/assets/svg/down-arrow-white.svg"
import Image from 'next/image';


interface Props {
  text: string;       // 드롭다운에 보여줄 텍스트
  height: number;     // 드롭다운 높이 (48 or 54)

  isOpen: boolean;                      // 드롭다운 클릭 여부
  handleDropdown: () => void;           // 드롭다운 클릭 이벤트 함수

  items: string[];                      // 아이템 텍스트 리스트
  onItemClick: (item: string) => void;  // 아이템 클릭 이벤트 처리 함수
}

const Dropdown = ({text, height, isOpen, handleDropdown, items, onItemClick}: Props) => {
  /*
  // 드롭다운 클릭 여부
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 드롭다운 클릭 이벤트 함수
  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };
  */

  return (
    <div>
      {/* 드롭다운 버튼 */}
      <div
        onClick={handleDropdown}
        className={`inline-flex items-center h-${height} pl-4 pr-3 bg-grayscale-800 border-[1.5px] border-grayscale-700 rounded-[8px]`}
      >
        <div className="text-grayscale-400 text-[14pt] w-[212px] font-regular">
          {text}
        </div>
        {/* V, ^ 버튼 이미지 (활성화 상태에 따라 이미지 변경) */}
        <Image src={DArrowWhiteIcon} alt="화살표" className="cursor-pointer" width={28} height={28} />
      </div>

        
      
      {/* 드롭다운 메뉴 (isOpen이 true일 때만 표시) */}
      {isOpen && (
        <div className="absolute left-0 w-[268px] bg-grayscale-800 border-[1.5px] border-grayscale-700 rounded-[8px]">
          <ul>
            {items.map((item, index) => (
              <li 
                key={index}
                className="px-4 py-2 w-full rounded-[8px] text-grayscale-400 text-[14pt] font-regular cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
