'use client'

import Image from 'next/image'
import LogoIcon from '@/assets/svg/logo.svg'
import PensilGraySmIcon from '@/assets/svg/mypage/pensil-gray-sm.svg'
import LinkAccentLgIcon from '@/assets/svg/mypage/link-accent-lg.svg'
import TimeIcon from '@/assets/svg/mypage/time.svg'
import RankBarIcon from '@/assets/svg/mypage/rankbar.svg'
import { useEffect, useState } from 'react'
import IconButton from '@/components/global/button/IconButton'
import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconTextButton from '@/components/global/button/IconTextButton'
import MogakRoom, { MogakRoomProps } from '@/components/app/home/MogakRoom'
import Pagenation from '@/components/global/pagenation/Pagenation'
import TodayBlock from '@/components/app/mypage/TodayBlock'
import ProfileSettingButton from '@/components/app/mypage/ProfileSettingButton'

////////////////////////////////////////////////////
// 임시
const mogakRooms1: MogakRoomProps[] = [
  {
    index: 1,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: LogoIcon,
    capacity: 20,
    headcount: 16,
    sunup: true,
    sun: true,
    sundown: true,
    moon: true,
    secret: false,
    onClick: () => null,
  },
  {
    index: 2,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: LogoIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: true,
    sundown: false,
    moon: true,
    secret: true,
    onClick: () => null,
  },
  {
    index: 3,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: LogoIcon,
    capacity: 20,
    headcount: 16,
    sunup: true,
    sun: true,
    sundown: true,
    moon: true,
    secret: false,
    onClick: () => null,
  },
  {
    index: 4,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: LogoIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: true,
    sundown: false,
    moon: true,
    secret: false,
    onClick: () => null,
  },
  {
    index: 5,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: LogoIcon,
    capacity: 20,
    headcount: 16,
    sunup: true,
    sun: true,
    sundown: true,
    moon: true,
    secret: true,
    onClick: () => null,
  },
  {
    index: 6,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: LogoIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: false,
    sundown: true,
    moon: false,
    secret: false,
    onClick: () => null,
  },
  {
    index: 7,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: LogoIcon,
    capacity: 20,
    headcount: 16,
    sunup: false,
    sun: false,
    sundown: false,
    moon: true,
    secret: false,
    onClick: () => null,
  },
  {
    index: 8,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: LogoIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: true,
    sundown: false,
    moon: false,
    secret: false,
    onClick: () => null,
  },
]

const mogakRooms2: MogakRoomProps[] = [
  {
    index: 1,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: LogoIcon,
    capacity: 20,
    headcount: 16,
    sunup: true,
    sun: true,
    sundown: true,
    moon: true,
    secret: false,
    onClick: () => null,
  },
  {
    index: 2,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: LogoIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: true,
    sundown: false,
    moon: true,
    secret: true,
    onClick: () => null,
  },
]
////////////////////////////////////////////////////

export default function MyPage() {
  // 사용자 정보
  const [profileIcon, setProfileIcon] = useState<string>('')
  const [nickname, setNickname] = useState<string>('임시닉네임 인애')
  const [profileLink, setProfileLink] = useState<string>('https://github.com/inaemon')
  const [workHours, setWorkHours] = useState<string>('25')
  const [workSeconds, setWorkSeconds] = useState<string>('41')
  const [rank, setRank] = useState<string>('26')
  const [isSetting, setSettting] = useState<boolean>(false)

  // 모각방 탭 핸들링
  const [toggleTab, setToggleTab] = useState<boolean>(false)
  const onTab = 'semi-18 text-gray-50 border-b-[2px] border-white cursor-pointer'
  const offTab = 'med-18 text-gray-400 cursor-pointer'
  const handleTab1 = () => {
    setToggleTab(true)
  }
  const handleTab2 = () => {
    setToggleTab(false)
  }

  // 페이지네이션
  const itemsPerPage = 12 // 한 페이지에 보여줄 항목 수
  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
  const [currentRooms, setCurrentRooms] = useState<MogakRoomProps[]>([]) // 현재 페이지에 해당되는 모각방
  const [totalPage, setTotalPage] = useState(1) // 총 페이지 수
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }
  // 현재 페이지에 보여줄 모각방
  useEffect(() => {
    const mogakRooms = toggleTab ? mogakRooms1 : mogakRooms2
    if (mogakRooms) {
      setTotalPage(Math.ceil(mogakRooms.length / itemsPerPage)) // 총 페이지 수 계산
      setCurrentRooms(mogakRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)) // 현재 페이지에 해당하는 방들 설정
    }
  }, [currentPage, toggleTab, mogakRooms1, mogakRooms2])

  return (
    <div className="">
      {/**프로필 */}
      <div className="flex justify-between items-start w-full px-[80px] mt-[40px] h-[162px]">
        <div className="flex px-[20px]">
          {/* 프로필 이미지 */}
          <div className="flex justify-center items-center rounded-full border-2 border-gray-600 w-[92px] h-[92px] bg-gray-800">
            {!profileIcon ? (
              <Image src={LogoIcon} alt="profile" width={48} height={24} />
            ) : (
              <Image src={profileIcon} alt="profile" />
            )}
          </div>

          <div className=" ml-[24px]">
            <div className="flex items-center gap-[16px] mb-[8px]">
              {/* 프로필 닉네임 */}
              <p className="text-gray-50 bold-32 ">{nickname}</p>
              {/* 프로필 수정 */}
              <IconButton
                theme={ButtonTheme.white}
                variant={ButtonVariant.default}
                size={ButtonSize.sm}
                iconSrc={PensilGraySmIcon}
                handleClick={() => setSettting(!isSetting)}
              />
            </div>

            {/* 프로필 링크 */}
            <a href={profileLink} target="_blank" rel="noopener noreferrer">
              <IconTextButton
                theme={ButtonTheme.accent}
                variant={ButtonVariant.default}
                size={ButtonSize.lg}
                iconSrc={LinkAccentLgIcon}
                iconArrow={IconArrow.left}
                text={profileLink}
                link={true}
                handleClick={() => null}
              />
            </a>
          </div>

          {isSetting && (
            <div className="ml-[9px]">
              <ProfileSettingButton
                nickname={nickname}
                setNickname={setNickname}
                link={profileLink}
                setLink={setProfileLink}
              />
            </div>
          )}
        </div>

        <div className="flex ">
          {/* 누적 시간 블록 */}
          <TodayBlock title="오늘의 누적 작업시간" icon={TimeIcon} data1={workHours} data2={workSeconds} />

          {/* 랭킹 블록 */}
          <div className="ml-[16px]">
            <TodayBlock title="오늘의 작업자 랭킹" icon={RankBarIcon} data1={rank} />
          </div>
        </div>
      </div>

      {/* 모각방 토글 버튼 */}
      <div className="flex border-b-[2px] border-gray-800 px-[80px]">
        <p className={`${toggleTab ? onTab : offTab} px-[11px] pb-[14px]`} onClick={handleTab1}>
          7일 간 들어갔던 모각방
        </p>
        <p className={`${!toggleTab ? onTab : offTab} ml-[23px] px-[11px] pb-[14px]`} onClick={handleTab2}>
          내가 만든 모각방
        </p>
      </div>

      {/* 모각방 리스트 */}
      <div className="px-[80px] mt-[24px]">
        <div className="grid grid-cols-4 mt-[12px]">
          {currentRooms.map((room, index) => (
            <div className="mb-[40px]">
              <MogakRoom
                index={room.index}
                key={index}
                title={room.title}
                description={room.description}
                thumbnailImageSrc={room.thumbnailImageSrc}
                capacity={room.capacity}
                headcount={room.headcount}
                sunup={room.sunup}
                sun={room.sun}
                sundown={room.sundown}
                moon={room.moon}
                secret={room.secret}
                onClick={room.onClick}
              />
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center mt-[20px]">
          <Pagenation currentPageNumber={currentPage} handlePageChange={handlePageChange} lastPageNumber={totalPage} />
        </div>
      </div>
    </div>
  )
}
