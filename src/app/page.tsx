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
import NoMogakRoom from '@/components/app/home/NoMogakRoom'
import { getAllRoomList, getRecentRoomList } from './api/home/api'
import { WorkHours } from './api/room/room.types'
import { Room } from './api/home/home.types'
import Link from 'next/link'
import { getDescriptionByWorkTimeId, getNameByWorkTimeId, ROOM_CAPACITY } from '@/constants/Room'

export default function Home() {
  // 모각방 페이지
  const itemsPerPage = 12 // 한 페이지에 보여줄 항목 수
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsByLatest, setRoomsByLatest] = useState<Room[]>([]) // 최신 모각방 TOP 4
  const [roomsByWorkHours, setRoomsByWorkHours] = useState<Room[]>([]) // 시간대별 모각방 전체 리스트
  const [currentPageRoomsByWorkHours, setCurrentPageRoomsByWorkHours] = useState<Room[]>([]) // 시간대별 모각방 현재 페이지에 해당되는 리스트
  const [totalPage, setTotalPage] = useState(1) // 총 페이지 수

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // 모각방 시간대 버튼
  const [toggleTimes, setToggleTimes] = useState<Record<string, { active: boolean; text1: string; text2: string }>>({
    time1: { active: true, text1: '전체', text2: '' },
    time2: { active: true, text1: getNameByWorkTimeId('LATE_NIGHT'), text2: getDescriptionByWorkTimeId('LATE_NIGHT') },
    time3: { active: true, text1: getNameByWorkTimeId('MORNING'), text2: getDescriptionByWorkTimeId('MORNING') },
    time4: { active: true, text1: getNameByWorkTimeId('AFTERNOON'), text2: getDescriptionByWorkTimeId('AFTERNOON') },
    time5: { active: true, text1: getNameByWorkTimeId('NIGHT'), text2: getDescriptionByWorkTimeId('NIGHT') },
  })

  // 시간대 버튼 토글 이벤트
  const handleToggleTime = (id: number) => {
    setToggleTimes((prevToggleTimes) => {
      let updatedToggleTimes = {
        ...prevToggleTimes,
        [`time${id}`]: {
          ...prevToggleTimes[`time${id}`],
          active: !prevToggleTimes[`time${id}`].active, // active 상태 반전
        },
      }

      if (id === 1) {
        const newActiveState = updatedToggleTimes.time1.active

        // time2~5도 time1과 동일하게 설정
        for (let i = 2; i <= 5; i++) {
          updatedToggleTimes[`time${i}`].active = newActiveState
        }
      } else {
        // time1은 time2~5가 모두 true면 true 아니면 false
        updatedToggleTimes.time1.active =
          updatedToggleTimes.time2.active === true &&
          updatedToggleTimes.time3.active === true &&
          updatedToggleTimes.time4.active === true &&
          updatedToggleTimes.time5.active === true
      }

      return updatedToggleTimes
    })
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

  // 시간대별 모각방 조회
  const searchAllRoomList = async () => {
    try {
      const workHours = getSelectedWorkHours()

      // workHours를 인자로 전달하여 API 호출
      let data
      if (workHours) data = await getAllRoomList({ page: currentPage, size: itemsPerPage, workHours: workHours })
      else data = await getAllRoomList({ page: currentPage, size: itemsPerPage })
      console.log('시간대별 모각방 조회를 성공했습니다.')
      //console.log(data)
      //console.log(data.data.rooms)

      const rooms = data.data.rooms
      setRoomsByWorkHours(rooms)
      resetCurrentPage(rooms)
    } catch (error) {
      console.error(error)
    }
  }

  // 최근 모각방 조회
  const searchRecentRoomList = async () => {
    try {
      const data = await getRecentRoomList()
      console.log('최근 모각방 조회를 성공했습니다.')
      //console.log(data)

      const rooms = data.data
      setRoomsByLatest(rooms)
    } catch (error) {
      console.error(error)
    }
  }

  // 방이 1개 이상이면 true, 0개면 false
  const isRoom = (room: Room) => {
    if (toggleTimes['time1'].active) {
      if (
        room.workHours.includes('MORNING') &&
        room.workHours.includes('AFTERNOON') &&
        room.workHours.includes('NIGHT') &&
        room.workHours.includes('LATE_NIGHT')
      ) {
        return true
      }
    }

    if (toggleTimes['time2'].active) {
      if (room.workHours.includes('LATE_NIGHT')) {
        return true
      }
    }

    if (toggleTimes['time3'].active) {
      if (room.workHours.includes('MORNING')) {
        return true
      }
    }

    if (toggleTimes['time4'].active) {
      if (room.workHours.includes('AFTERNOON')) {
        return true
      }
    }

    if (toggleTimes['time5'].active) {
      if (room.workHours.includes('NIGHT')) {
        return true
      }
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
    searchAllRoomList() // 시간대별 조회
    searchRecentRoomList() // 최근 TOP4 조회
  }, [])

  // 시간대별 방 업데이트
  useEffect(() => {
    if (
      toggleTimes.time1.active === false &&
      toggleTimes.time2.active === false &&
      toggleTimes.time3.active === false &&
      toggleTimes.time4.active === false &&
      toggleTimes.time5.active === false
    ) {
      // 초기화 (방 0개)
      setRoomsByWorkHours([])
      setCurrentPageRoomsByWorkHours([])
    } else {
      // API
      searchAllRoomList() // 시간대별 조회
    }
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
            <NoMogakRoom recent={true} />
          </div>
        ) : (
          <div className="grid grid-cols-4 mt-[12px]">
            {/** 최대 4개 방만 출력 */}
            {roomsByLatest.map(
              (room, index) =>
                index < 4 && (
                  <Link href={`/room/${room.roomId}`} key={'recent room' + index + room.roomName + room.roomId}>
                    <MogakRoom
                      index={room.roomId}
                      title={room.roomName}
                      description={room.roomExplain}
                      thumbnailImageSrc={room.roomImg}
                      capacity={ROOM_CAPACITY}
                      headcount={room.userCnt}
                      sunup={room.workHours.includes('MORNING')}
                      sun={room.workHours.includes('AFTERNOON')}
                      sundown={room.workHours.includes('NIGHT')}
                      moon={room.workHours.includes('LATE_NIGHT')}
                      secret={room.isLocked}
                      onClick={() => null}
                    />
                  </Link>
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
                      key={'active time chip' + index}
                    />
                  ) : (
                    <TextChip
                      size={ChipSize.lg}
                      theme={ChipTheme.LIGHT}
                      variant={ChipVariant.STROKE}
                      text={toggleTimes[key].text1}
                      detailText={toggleTimes[key].text2}
                      handleClick={() => handleToggleTime(index + 1)}
                      key={'non-active time chip' + index}
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
              <NoMogakRoom recent={false} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 mt-[12px]">
                {currentPageRoomsByWorkHours.map(
                  (room, index) =>
                    isRoom(room) && (
                      <Link href={`/room/${room.roomId}`} key={'workhours room' + index + room.roomName + room.roomId}>
                        <MogakRoom
                          index={room.roomId}
                          title={room.roomName}
                          description={room.roomExplain}
                          thumbnailImageSrc={room.roomImg}
                          capacity={ROOM_CAPACITY}
                          headcount={room.userCnt}
                          sunup={room.workHours.includes('MORNING')}
                          sun={room.workHours.includes('AFTERNOON')}
                          sundown={room.workHours.includes('NIGHT')}
                          moon={room.workHours.includes('LATE_NIGHT')}
                          secret={room.isLocked}
                          onClick={() => null}
                        />
                      </Link>
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
