'use client'

import CheckIcon from '@/assets/svg/check-accent-l.svg'
import Pagenation from '@/components/global/pagenation/Pagenation'
import { useState } from 'react'
import IconTextChip from '@/components/global/chip/IconTextChip'
import { ChipSize, ChipTheme, ChipVariant, DetailTextArrow, IconArrow } from '@/components/global/chip/chip.types'
import TextChip from '@/components/global/chip/TextChip'
import MogakRoom from '@/components/app/home/MogakRoom'
import NoMogakRoom from '@/components/app/home/NoMogakRoom'
import { WorkHours } from '@/app/api/room/room.types'
import { getDescriptionByWorkTimeId, getNameByWorkTimeId, ROOM_CAPACITY } from '@/constants/Room'
import HomeBanner from './HomeBanner'
import { useGetRecentRooms, useGetAllRooms } from '../queries'
import { useTimeFilter } from '../hooks/useTimeFilter'

const WORK_HOUR_FILTERS: { workHour: WorkHours; label: string; description: string }[] = [
  {
    workHour: 'LATE_NIGHT',
    label: getNameByWorkTimeId('LATE_NIGHT'),
    description: getDescriptionByWorkTimeId('LATE_NIGHT'),
  },
  { workHour: 'MORNING', label: getNameByWorkTimeId('MORNING'), description: getDescriptionByWorkTimeId('MORNING') },
  {
    workHour: 'AFTERNOON',
    label: getNameByWorkTimeId('AFTERNOON'),
    description: getDescriptionByWorkTimeId('AFTERNOON'),
  },
  { workHour: 'NIGHT', label: getNameByWorkTimeId('NIGHT'), description: getDescriptionByWorkTimeId('NIGHT') },
]

export default function HomeContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const { selectedWorkHours, isAllSelected, isNoneSelected, toggleAll, toggleWorkHour, workHoursParam } =
    useTimeFilter()

  const { data: recentRooms = [] } = useGetRecentRooms()
  const { data: allRoomsData } = useGetAllRooms(currentPage, workHoursParam, !isNoneSelected)

  const rooms = isNoneSelected ? [] : (allRoomsData?.rooms ?? [])
  const totalPages = allRoomsData?.totalPages ?? 1

  return (
    <div className="flex justify-center items-center mt-[40px] w-full">
      <div className="grid grid-cols-1 max-w-[1280px] w-full mx-auto">
        <HomeBanner />

        <div className="flex-row mt-[64px]">
          <p className="reg-14 text-grayscale-400">최근에 만들어진 모각방</p>
          <p className="semi-20 text-white">갓 나온 따끈따끈한 모각방</p>
        </div>
        {recentRooms.length === 0 ? (
          <div className="mt-[30px]">
            <NoMogakRoom recent={true} />
          </div>
        ) : (
          <div className="grid grid-cols-4 mt-[12px]">
            {recentRooms.slice(0, 4).map((room) => (
              <div key={room.roomId}>
                <MogakRoom
                  index={room.roomId}
                  title={room.roomName}
                  description={room.roomExplain}
                  thumbnailImageSrc={room.roomImg}
                  capacity={ROOM_CAPACITY}
                  headcount={room.userCnt}
                  sunup={room.workHours?.includes('MORNING')}
                  sun={room.workHours?.includes('AFTERNOON')}
                  sundown={room.workHours?.includes('NIGHT')}
                  moon={room.workHours?.includes('LATE_NIGHT')}
                  secret={room.isLocked}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex-row mt-[71px]">
          <p className="semi-20 text-white">시간대 별 모각방</p>

          <div className="flex justify-between mt-[8px]">
            <div>
              <span className="mr-[12px]">
                {isAllSelected ? (
                  <IconTextChip
                    size={ChipSize.lg}
                    theme={ChipTheme.ACCENT}
                    variant={ChipVariant.STROKE}
                    iconImageSrc={CheckIcon}
                    iconArrow={IconArrow.RIGHT}
                    text="전체"
                    detailText=""
                    handleClick={toggleAll}
                  />
                ) : (
                  <TextChip
                    size={ChipSize.lg}
                    theme={ChipTheme.LIGHT}
                    variant={ChipVariant.STROKE}
                    text="전체"
                    detailText=""
                    handleClick={toggleAll}
                  />
                )}
              </span>
              {WORK_HOUR_FILTERS.map(({ workHour, label, description }) => {
                const active = selectedWorkHours.has(workHour)
                return (
                  <span className="mr-[12px]" key={workHour}>
                    {active ? (
                      <IconTextChip
                        size={ChipSize.lg}
                        theme={ChipTheme.ACCENT}
                        variant={ChipVariant.STROKE}
                        iconImageSrc={CheckIcon}
                        iconArrow={IconArrow.RIGHT}
                        text={label}
                        detailText={description}
                        handleClick={() => toggleWorkHour(workHour)}
                      />
                    ) : (
                      <TextChip
                        size={ChipSize.lg}
                        theme={ChipTheme.LIGHT}
                        variant={ChipVariant.STROKE}
                        text={label}
                        detailText={description}
                        handleClick={() => toggleWorkHour(workHour)}
                      />
                    )}
                  </span>
                )
              })}
            </div>
            <TextChip
              size={ChipSize.lg}
              theme={ChipTheme.DARK}
              variant={ChipVariant.DEFAULT}
              text={`${rooms.length}개`}
              detailText="조건에 맞는 모각방"
              detailTextArrow={DetailTextArrow.LEFT}
              handleClick={() => null}
            />
          </div>

          {rooms.length === 0 ? (
            <div className="mt-[106px]">
              <NoMogakRoom recent={false} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 mt-[12px]">
                {rooms.map((room) => (
                  <div key={room.roomId}>
                    <MogakRoom
                      index={room.roomId}
                      title={room.roomName}
                      description={room.roomExplain}
                      thumbnailImageSrc={room.roomImg}
                      capacity={ROOM_CAPACITY}
                      headcount={room.userCnt}
                      sunup={room.workHours?.includes('MORNING')}
                      sun={room.workHours?.includes('AFTERNOON')}
                      sundown={room.workHours?.includes('NIGHT')}
                      moon={room.workHours?.includes('LATE_NIGHT')}
                      secret={room.isLocked}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center mt-[60px]">
                <Pagenation
                  currentPageNumber={currentPage}
                  handlePageChange={setCurrentPage}
                  lastPageNumber={totalPages}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
