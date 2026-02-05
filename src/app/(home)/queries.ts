import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getAllRoomList, getRecentRoomList } from '../api/home/api'
import { GetRoomsResponseData, Room } from '../api/home/home.types'
import { WorkHours } from '../api/room/room.types'

const ITEMS_PER_PAGE = 12

export const useGetRecentRooms = () => {
  return useQuery<Room[]>({
    queryKey: ['recentRooms'],
    queryFn: async () => {
      const res = await getRecentRoomList()
      return res.data
    },
  })
}

export const useGetAllRooms = (page: number, workHours?: WorkHours[], enabled: boolean = true) => {
  return useQuery<GetRoomsResponseData>({
    queryKey: ['allRooms', page, workHours],
    queryFn: async () => {
      const res = await getAllRoomList({ page, size: ITEMS_PER_PAGE, workHours })
      return res.data
    },
    placeholderData: keepPreviousData,
    enabled,
  })
}
