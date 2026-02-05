'use client'

import { useState } from 'react'
import MogakRoom from '@/components/app/home/MogakRoom'
import Pagenation from '@/components/global/pagenation/Pagenation'
import { ROOM_CAPACITY } from '@/constants/Room'
import { useGetMyRooms, useGetSevenDaysRooms } from '../queries'

type TabType = 'sevenDays' | 'myRooms'

const TAB_STYLES = {
  active: 'semi-18 text-gray-50 border-b-[2px] border-white cursor-pointer',
  inactive: 'med-18 text-gray-400 cursor-pointer',
}

export default function RoomTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('myRooms')
  const [sevenDaysPage, setSevenDaysPage] = useState(1)
  const [myRoomsPage, setMyRoomsPage] = useState(1)

  const currentPage = activeTab === 'sevenDays' ? sevenDaysPage : myRoomsPage
  const setCurrentPage = activeTab === 'sevenDays' ? setSevenDaysPage : setMyRoomsPage

  const { data: sevenDaysData } = useGetSevenDaysRooms(sevenDaysPage)
  const { data: myRoomsData } = useGetMyRooms(myRoomsPage)

  const activeData = activeTab === 'sevenDays' ? sevenDaysData : myRoomsData
  const rooms = activeData?.rooms ?? []
  const totalPage = activeData?.totalPage ?? 1

  return (
    <>
      <ul className="flex border-b-[2px] border-gray-800 px-[80px]">
        <li
          className={`${activeTab === 'sevenDays' ? TAB_STYLES.active : TAB_STYLES.inactive} px-[11px] pb-[14px]`}
          onClick={() => setActiveTab('sevenDays')}
        >
          7일 간 들어갔던 모각방
        </li>
        <li
          className={`${activeTab === 'myRooms' ? TAB_STYLES.active : TAB_STYLES.inactive} ml-[23px] px-[11px] pb-[14px]`}
          onClick={() => setActiveTab('myRooms')}
        >
          내가 만든 모각방
        </li>
      </ul>

      <div className="px-[80px] mt-[24px]">
        {rooms.length > 0 ? (
          <div className="grid grid-cols-4 mt-[12px]">
            {rooms.map((room) => (
              <div className="mb-[40px]" key={room.roomId}>
                <MogakRoom
                  index={room.roomId}
                  title={room.roomName}
                  description={room.roomExplain}
                  thumbnailImageSrc={room.roomImgUrl}
                  capacity={ROOM_CAPACITY}
                  headcount={room.userCnt}
                  sunup={room.workHours?.includes('MORNING') ?? false}
                  sun={room.workHours?.includes('AFTERNOON') ?? false}
                  sundown={room.workHours?.includes('NIGHT') ?? false}
                  moon={room.workHours?.includes('LATE_NIGHT') ?? false}
                  secret={room.isLocked}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[400px] flex justify-center items-center">
            <span className="text-grayscale-50">모각방이 아직 없어요.</span>
          </div>
        )}

        {totalPage > 1 && (
          <div className="flex justify-center items-center mt-[20px]">
            <Pagenation currentPageNumber={currentPage} handlePageChange={setCurrentPage} lastPageNumber={totalPage} />
          </div>
        )}
      </div>
    </>
  )
}
