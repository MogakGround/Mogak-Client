'use client'

import Image from 'next/image'
import AreaIcon from '@/assets/svg/home/area.svg'
import CheckIcon from '@/assets/svg/check-accent-l.svg'
import Pagenation from '@/components/global/pagenation/Pagenation'
import { useEffect, useState } from 'react'
import IconTextChip from '@/components/global/chip/IconTextChip'
import { ChipSize, ChipTheme, ChipVariant, DetailTextArrow, IconArrow } from '@/components/global/chip/chip.types'
import TextChip from '@/components/global/chip/TextChip'
import MogakRoom, { MogakRoomProps } from '@/components/app/home/MogakRoom'

////////////////////////////////////////////////////
// 임시
const mogakRooms: MogakRoomProps[] = [
  {
    index: 1,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: AreaIcon,
    capacity: 20,
    headcount: 16,
    sunup: true,
    sun: true,
    sundown: true,
    moon: true,
  },
  {
    index: 2,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: AreaIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: true,
    sundown: false,
    moon: true,
  },
  {
    index: 3,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: AreaIcon,
    capacity: 20,
    headcount: 16,
    sunup: true,
    sun: true,
    sundown: true,
    moon: true,
  },
  {
    index: 4,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: AreaIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: true,
    sundown: false,
    moon: true,
  },
  {
    index: 5,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: AreaIcon,
    capacity: 20,
    headcount: 16,
    sunup: true,
    sun: true,
    sundown: true,
    moon: true,
  },
  {
    index: 6,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: AreaIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: false,
    sundown: true,
    moon: false,
  },
  {
    index: 7,
    title: '백엔드개발자 드루와요',
    description: '설명 텍스트',
    thumbnailImageSrc: AreaIcon,
    capacity: 20,
    headcount: 16,
    sunup: false,
    sun: false,
    sundown: false,
    moon: true,
  },
  {
    index: 8,
    title: '프론트엔드 개발자 모집',
    description: '프론트엔드 개발자 채용 설명',
    thumbnailImageSrc: AreaIcon,
    capacity: 15,
    headcount: 10,
    sunup: false,
    sun: true,
    sundown: false,
    moon: false,
  },
]
////////////////////////////////////////////////////

export default function Home() {
  // 모각방 페이지
  const itemsPerPage = 12 // 한 페이지에 보여줄 항목 수
  const [currentPage, setCurrentPage] = useState(1)
  const [currentRooms, setCurrentRooms] = useState<MogakRoomProps[]>([]) // 현재 페이지에 해당되는 모각방
  const [totalPage, setTotalPage] = useState(1) // 총 페이지 수
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // 모각방 시간대 버튼
  const [toggleTimes, setToggleTimes] = useState<Record<string, { active: boolean; text1: string; text2: string }>>({
    time1: { active: false, text1: '전체', text2: '' },
    time2: { active: false, text1: '야간', text2: '오후 10시 ~ 오전 5시' },
    time3: { active: false, text1: '오전 시간대', text2: '아침 6시 ~ 정오' },
    time4: { active: false, text1: '오후 시간대', text2: '정오 ~ 오후 6시' },
    time5: { active: false, text1: '저녁 시간대', text2: '오후 6시 ~ 오후 10시' },
  })

  const handleToggleTime = (id: number) => {
    setToggleTimes((prevToggleTimes) => ({
      ...prevToggleTimes,
      [`time${id}`]: {
        ...prevToggleTimes[`time${id}`],
        active: !prevToggleTimes[`time${id}`].active, // active 상태 반전
      },
    }))
  }

  // 조건에 맞는 모각방 구하기기
  const countRooms = () => {
    let filtered: MogakRoomProps[] = []

    // time1에 해당하는 필터
    if (toggleTimes.time1.active) {
      filtered = [...filtered, ...mogakRooms.filter((room) => room.sunup && room.sun && room.sundown && room.moon)]
    }

    // time2에 해당하는 필터
    if (toggleTimes.time2.active) {
      filtered = [...filtered, ...mogakRooms.filter((room) => room.sunup)]
    }

    // time3에 해당하는 필터
    if (toggleTimes.time3.active) {
      filtered = [...filtered, ...mogakRooms.filter((room) => room.sun)]
    }

    // time4에 해당하는 필터
    if (toggleTimes.time4.active) {
      filtered = [...filtered, ...mogakRooms.filter((room) => room.sundown)]
    }

    // time5에 해당하는 필터
    if (toggleTimes.time5.active) {
      filtered = [...filtered, ...mogakRooms.filter((room) => room.moon)]
    }

    const uniqueFiltered = filtered.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.index === value.index && // index(고유키)를 기준으로 중복 제거
            t.title === value.title &&
            t.description === value.description &&
            t.sunup === value.sunup &&
            t.sun === value.sun &&
            t.sundown === value.sundown &&
            t.moon === value.moon
        )
    )

    return uniqueFiltered
  }

  // 페이지네이션 및 필터링을 고려한 현재 페이지의 방들을 설정
  useEffect(() => {
    const filtered = countRooms()

    if (filtered) {
      setTotalPage(Math.ceil(filtered.length / itemsPerPage)) // 총 페이지 수 계산
      setCurrentRooms(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)) // 현재 페이지에 해당하는 방들 설정
    }
  }, [currentPage, toggleTimes])

  return (
    <div className="flex justify-center items-center mt-[40px] w-full">
      <div className="grid grid-cols-1">
        <Image src={AreaIcon} alt="area" />

        <div className="flex-row mt-[64px]">
          <p className="reg-14 text-grayscale-400">최근에 만들어진 모각방</p>
          <p className="semi-20 text-white">갓 나온 따끈따끈한 모각방</p>
        </div>

        <div className="grid grid-cols-4 mt-[12px]">
          {/** 최대 4개 방만 출력 */}
          {mogakRooms.map(
            (room, index) =>
              index < 4 && (
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
                />
              )
          )}
        </div>

        <div className="flex-row mt-[71px]">
          <p className="semi-20 text-white">시간대 별 모각방</p>

          <div className="flex justify-between">
            <div>
              {Object.keys(toggleTimes).map((key, index) => (
                <span className="mr-[12px]">
                  {toggleTimes[key].active ? (
                    <IconTextChip
                      size={ChipSize.lg}
                      theme={ChipTheme.ACCENT}
                      variant={ChipVariant.STROKE}
                      iconImageSrc={CheckIcon}
                      iconArrow={IconArrow.RIGHT}
                      text={toggleTimes[key].text1}
                      detailText={toggleTimes[key].text2}
                      handleClick={() => handleToggleTime(index + 1)}
                      key={key}
                    />
                  ) : (
                    <TextChip
                      size={ChipSize.lg}
                      theme={ChipTheme.LIGHT}
                      variant={ChipVariant.STROKE}
                      text={toggleTimes[key].text1}
                      detailText={toggleTimes[key].text2}
                      handleClick={() => handleToggleTime(index + 1)}
                      key={key}
                    />
                  )}
                </span>
              ))}
            </div>
            <TextChip
              size={ChipSize.lg}
              theme={ChipTheme.DARK}
              variant={ChipVariant.DEFAULT}
              text={`${!countRooms() ? -1 : countRooms()?.length}개`}
              detailText={'조건에 맞는 모각방'}
              detailTextArrow={DetailTextArrow.LEFT}
              handleClick={() => null}
            />
          </div>

          {/* 페이지네이션 */}
          <div className="grid grid-cols-4 mt-[12px]">
            {currentRooms.map((room, index) =>
              room.sunup && room.sun && room.sundown && room.moon && toggleTimes['time1'].active ? (
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
                />
              ) : room.sunup && toggleTimes['time2'].active ? (
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
                />
              ) : room.sun && toggleTimes['time3'].active ? (
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
                />
              ) : room.sundown && toggleTimes['time4'].active ? (
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
                />
              ) : room.moon && toggleTimes['time5'].active ? (
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
                />
              ) : (
                <></>
              )
            )}
          </div>

          <div className="flex justify-center items-center mt-[60px]">
            <Pagenation
              currentPageNumber={currentPage}
              handlePageChange={handlePageChange}
              lastPageNumber={totalPage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
