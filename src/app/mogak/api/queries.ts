import { useUserStore } from '@/store/userStore'
import { useQuery } from '@tanstack/react-query'
import { MyStatusResponse, RoomMembers, RoomResponse, ScreenShareMembersResponse, TimerListResponse } from './type'
import { getMyStatus, getRoomInfo, getRoomMembers, getScreenShareMembers, getTimerList } from './api'

export const useGetRoomInfo = (id: string) => {
  return useQuery<RoomResponse>({
    queryKey: ['roomInfo', id],
    queryFn: () => getRoomInfo(id),
    enabled: !!id,
  })
}

export const useGetMyStatus = (id: string) => {
  return useQuery<MyStatusResponse>({
    queryKey: ['mystatus', id],
    queryFn: () => getMyStatus(id),
  })
}
export const useGetRoomMembers = (id: string) => {
  const { userID } = useUserStore()

  return useQuery<RoomMembers>({
    queryKey: ['roomMembers', id],
    queryFn: async () => {
      const res = await getRoomMembers(id)
      const myUser = res.users.find((u) => u.userId === Number(userID))
      const otherUsers = res.users.filter((u) => u.userId !== Number(userID))

      return {
        usersWithMe: res.users,
        users: otherUsers,
        myUser,
        userCnt: res.userCnt,
      }
    },
  })
}

export const useGetTimerList = (id: string) => {
  return useQuery<TimerListResponse>({
    queryKey: ['timerList', id],
    queryFn: () => getTimerList(id),
  })
}

export const useGetScreenShareMembers = (id: string) => {
  return useQuery<ScreenShareMembersResponse>({
    queryKey: ['screenShareMembers', id],
    queryFn: () => getScreenShareMembers(id),
  })
}
