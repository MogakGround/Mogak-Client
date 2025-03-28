'use client'

import Image from 'next/image'
import AreaIcon from '@/assets/svg/home/area.svg'
import CheckIcon from '@/assets/svg/check-accent-l.svg'
import Pagenation from '@/components/global/pagenation/Pagenation'
import { useEffect, useState } from 'react'
import IconTextChip from '@/components/global/chip/IconTextChip'
import { ChipSize, ChipTheme, ChipVariant, DetailTextArrow, IconArrow } from '@/components/global/chip/chip.types'
import TextChip from '@/components/global/chip/TextChip'
import MogakRoom from '@/components/app/home/MogakRoom'
import BasicButton from '@/components/global/button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '@/components/global/button/button.types'
import NoMogakRoom from '@/components/app/home/NoMogakRoom'
import { getAllRoomList, getRecentRoomList } from './api/home/api'
import { WorkHours } from './api/room/room.types'
import { Room } from './api/home/home.types'

export default function Home() {
  // 모각방 페이지
  const itemsPerPage = 12 // 한 페이지에 보여줄 항목 수
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsByLatest, setRoomsByLatest] = useState<Room[]>([]) // 최신 모각방 TOP 4
  const [roomsByWorkHours, setRoomsByWorkHours] = useState<Room[]>([]) // 시간대별 모각방 전체 리스트
  const [currentPageRoomsByWorkHours, setCurrentPageRoomsByWorkHours] = useState<Room[]>([]) // 시간대별 모각방 현재 페이지에 해당되는 리스트
  const [totalPage, setTotalPage] = useState(1) // 총 페이지 수
  const roomCapacity = 20
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

  // 버튼 토글
  const handleToggleTime = (id: number) => {
    setToggleTimes((prevToggleTimes) => ({
      ...prevToggleTimes,
      [`time${id}`]: {
        ...prevToggleTimes[`time${id}`],
        active: !prevToggleTimes[`time${id}`].active, // active 상태 반전
      },
    }))
  }

  const getSelectedWorkHours = (): WorkHours[] | null => {
    const selectedWorkHours: WorkHours[] = []

    // time1이 active면 모든 WorkHours를 반환
    if (toggleTimes.time1.active) {
      return null
    }

    // time2가 active이면 LATE_NIGHT 추가
    if (toggleTimes.time2.active) {
      selectedWorkHours.push('LATE_NIGHT')
    }

    // time3가 active이면 MORNING 추가
    if (toggleTimes.time3.active) {
      selectedWorkHours.push('MORNING')
    }

    // time4가 active이면 AFTERNOON 추가
    if (toggleTimes.time4.active) {
      selectedWorkHours.push('AFTERNOON')
    }

    // time5가 active이면 NIGHT 추가
    if (toggleTimes.time5.active) {
      selectedWorkHours.push('NIGHT')
    }

    return selectedWorkHours
  }

  const searchAllRoomList = async () => {
    try {
      const workHours = getSelectedWorkHours()

      // workHours를 인자로 전달하여 API 호출
      let data
      if (workHours) data = await getAllRoomList({ page: currentPage, size: itemsPerPage, workHours: workHours })
      else data = await getAllRoomList({ page: currentPage, size: itemsPerPage })
      console.log(data.data.rooms)

      const rooms = data.data.rooms
      setRoomsByWorkHours(rooms)
      resetCurrentPage(rooms)
    } catch (error) {
      console.error(error)
    }
  }

  const searchRecentRoomList = async () => {
    try {
      const data = await getRecentRoomList()
      console.log(data.data.rooms)

      const rooms = data.data.rooms
      setRoomsByLatest(rooms)
    } catch (error) {
      console.error(error)
    }
  }

  /*
  const filterRooms = (rooms: Room[]) => {
    return rooms.filter((room) => {
      if (toggleTimes.time1.active) return room.sunup && room.sun && room.sundown && room.moon
      return (
        (toggleTimes.time2.active && room.sunup) ||
        (toggleTimes.time3.active && room.sun) ||
        (toggleTimes.time4.active && room.sundown) ||
        (toggleTimes.time5.active && room.moon)
      )
    })
  }

  // 조건에 맞는 모각방 구하기
  const countRooms = () => {
    let filtered: MogakRoomProps[] = []

    const mogakRooms: MogakRoomProps[] = currentRooms

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
  */

  const isRoom = (room: Room) => {
    if (
      room.workHours.includes('MORNING') &&
      room.workHours.includes('AFTERNOON') &&
      room.workHours.includes('NIGHT') &&
      room.workHours.includes('LATE_NIGHT')
    ) {
      if (toggleTimes['time1'].active) return true
    }

    if (room.workHours.includes('MORNING')) {
      if (toggleTimes['time2'].active) return true
    }

    if (room.workHours.includes('AFTERNOON')) {
      if (toggleTimes['time3'].active) return true
    }

    if (room.workHours.includes('NIGHT')) {
      if (toggleTimes['time4'].active) return true
    }

    if (room.workHours.includes('LATE_NIGHT')) {
      if (toggleTimes['time5'].active) return true
    }

    return false
  }

  // 페이지 계산
  const resetCurrentPage = (rooms: Room[]) => {
    if (rooms) {
      // 총 페이지 수 계산
      setTotalPage(Math.ceil(rooms.length / itemsPerPage))
      // 현재 페이지에 해당하는 방들 설정
      setCurrentPageRoomsByWorkHours(rooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage))
    }
  }

  useEffect(() => {
    // API
    searchAllRoomList() // 전체 조회
    searchRecentRoomList() // 최근 TOP4 조회
  }, [])

  useEffect(() => {
    // API
    searchAllRoomList() // 전체 조회
  }, [toggleTimes])

  // 페이지네이션 및 필터링을 고려한 현재 페이지의 방들을 설정
  useEffect(() => {
    resetCurrentPage(currentPageRoomsByWorkHours)
  }, [currentPage])

  return (
    <div className="flex justify-center items-center mt-[40px] w-full">
      <div className="grid grid-cols-1">
        <Image src={AreaIcon} alt="area" />

        <div className="flex-row mt-[64px]">
          <p className="reg-14 text-grayscale-400">최근에 만들어진 모각방</p>
          <p className="semi-20 text-white">갓 나온 따끈따끈한 모각방</p>
        </div>
        {!roomsByLatest || roomsByLatest.length === 0 ? (
          <div className="mt-[30px]">
            <NoMogakRoom />
          </div>
        ) : (
          <div className="grid grid-cols-4 mt-[12px]">
            {/** 최대 4개 방만 출력 */}
            {roomsByLatest.map(
              (room, index) =>
                index < 4 && (
                  <MogakRoom
                    index={room.roomId}
                    key={'recent room' + index + room.roomName + room.roomId}
                    title={room.roomName}
                    description={room.roomExplain}
                    thumbnailImageSrc={room.roomImg}
                    capacity={roomCapacity}
                    headcount={room.userCnt}
                    sunup={room.workHours.includes('MORNING')}
                    sun={room.workHours.includes('AFTERNOON')}
                    sundown={room.workHours.includes('NIGHT')}
                    moon={room.workHours.includes('LATE_NIGHT')}
                    secret={room.isLocked}
                    onClick={() => null}
                  />
                )
            )}
          </div>
        )}

        <div className="flex-row mt-[71px]">
          <p className="semi-20 text-white">시간대 별 모각방</p>

          <div className="flex justify-between mt-[8px]">
            <div>
              {Object.keys(toggleTimes).map((key, index) => (
                <span className="mr-[12px]" key={'time chip' + index}>
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
              text={`${roomsByWorkHours.length}개`}
              detailText={'조건에 맞는 모각방'}
              detailTextArrow={DetailTextArrow.LEFT}
              handleClick={() => null}
            />
          </div>

          {/* 페이지네이션 */}
          {!currentPageRoomsByWorkHours || currentPageRoomsByWorkHours.length === 0 ? (
            <div className="mt-[106px]">
              <NoMogakRoom />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 mt-[12px]">
                {currentPageRoomsByWorkHours.map(
                  (room, index) =>
                    isRoom(room) && (
                      <MogakRoom
                        index={room.roomId}
                        key={'workhours room' + index + room.roomName + room.roomId}
                        title={room.roomName}
                        description={room.roomExplain}
                        thumbnailImageSrc={room.roomImg}
                        capacity={roomCapacity}
                        headcount={room.userCnt}
                        sunup={room.workHours.includes('MORNING')}
                        sun={room.workHours.includes('AFTERNOON')}
                        sundown={room.workHours.includes('NIGHT')}
                        moon={room.workHours.includes('LATE_NIGHT')}
                        secret={room.isLocked}
                        onClick={() => null}
                      />
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
