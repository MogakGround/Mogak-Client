"use client"
import React, { useState } from 'react';
import DArrowGrayIcon from "@/assets/svg/down-arrow-gray.svg"
import DArrowWhiteIcon from "@/assets/svg/down-arrow-white.svg"
import UArrowWhiteIcon from "@/assets/svg/up-arrow-white.svg"
import Image from 'next/image';


interface Props {
  height: number;     // 드롭다운 높이 (48 or 54)

  isDisabled: boolean;                  // 드롭다운 활성화 여부
  isError: boolean;                     // 드롭다운 조건 불일치 여부

  isOpen: boolean;                      // 드롭다운 클릭 여부
  onDropdownClick: () => void;          // 드롭다운 클릭 이벤트 함수

  items: string[];                      // 아이템 텍스트 리스트
  onItemClick: (item: string) => void;  // 아이템 클릭 이벤트 함수
}

/**
 * 
 * @param height: 48, 54 중 하나
 */
const DefaultDropdown = ({height, isDisabled, isError, isOpen, onDropdownClick, items, onItemClick}: Props) => {
  /*
  // 드롭다운 클릭 여부
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 드롭다운 클릭 이벤트 함수
  const onDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  // 아이템 클릭 이벤트 함수
  const onItemClick = (item: string) => {
    setText(item);  // 클릭한 아이템 텍스트를 상태에 반영
    setIsOpen(false);  // 드롭다운 닫기
  };
  */
  

  // 드롭다운에 보여줄 텍스트
  const [text, setText] = useState(''); // 초기값
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 사용자가 입력한 텍스트로 상태 반영
    setText(e.target.value);
  };
  
  // 입력 필드 포커스 상태
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`items-center h-[${height}px] pl-4 pr-3 text-[14pt] w-[268px] font-regular rounded-[8px]
        ${isDisabled? "bg-grayscale-800 text-grayscale-600" : 
          !text? "bg-grayscale-800 border-grayscale-700 text-grayscale-400 border-[1.5px] hover:border-accentT-20 " :
          isError? "bg-primaryT-5 border-primaryT-20 text-grayscale-50 border-[1.5px]" :
          isFocused? "bg-accentT-5 border-accentT-20 text-grayscale-50 border-[1.5px]" : "bg-grayscale-800 border-grayscale-700 text-grayscale-50 border-[1.5px] hover:border-accentT-20 "
        }`}
    >

      {/* 드롭다운 버튼, 체크 순서: 비활성화 여부->텍스트무여부->에러여부->input포커스여부 */}
      <div className="inline-flex ">
        <div >
          <input
            type="text"
            value={text}                  // 상태 값을 입력 필드에 반영
            onChange={handleTextChange}   // 입력 변경 처리
            onFocus={() => setIsFocused(true)}  // focus 시 포커스 상태 true
            onBlur={() => setIsFocused(false)}  // blur 시 포커스 상태 false
            className={`w-[212px] h-[${height}px]
                        ${isDisabled? "bg-grayscale-800 " :
                        !text? "bg-grayscale-800" :
                        isError? "bg-primaryT-5 " :
                        isFocused? "bg-accentT-5 " : "bg-grayscale-800"}`}
            // 텍스트가 없으면 '플레이스 폴더'를 디폴트 값으로 표시
            placeholder={text === '' ? '플레이스 홀더' : ''} 
          />
        </div>
        
        {/* V, ^ 버튼 이미지 (활성화 상태에 따라 이미지 변경) */}
        {
        isDisabled?
          <Image src={DArrowGrayIcon} alt="화살표" className="cursor-pointer" width={28} height={28}/>
          :
        isFocused? 
          <Image src={DArrowWhiteIcon} alt="화살표" className="cursor-pointer" width={28} height={28} onClick={onDropdownClick}/>
          :
          <Image src={UArrowWhiteIcon} alt="화살표" className="cursor-pointer" width={28} height={28} onClick={onDropdownClick}/>
        }
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

export default DefaultDropdown;
