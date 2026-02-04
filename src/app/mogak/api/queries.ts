import { useUserStore } from '@/store/userStore'
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { MyStatusResponse, RoomMembers, RoomResponse, ScreenShareMembersResponse, TimerListResponse } from './type'
import { getMyStatus, getRoomInfo, getRoomMembers, getScreenShareMembers, getTimerList, postLeaveRoom } from './api'

export const useGetRoomInfo = (id: string) => {
  return useSuspenseQuery<RoomResponse>({
    queryKey: ['roomInfo', id],
    queryFn: () => getRoomInfo(id),
  })
}

export const useGetMyStatus = (id: string) => {
  return useSuspenseQuery<MyStatusResponse>({
    queryKey: ['mystatus', id],
    queryFn: () => getMyStatus(id),
    refetchOnMount: 'always',
  })
}

export const useGetRoomMembers = (id: string, userID: number, enabled: boolean = true) => {
  return useQuery<RoomMembers>({
    queryKey: ['roomMembers', id, userID],
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
    enabled,
  })
}

export const useGetTimerList = (id: string, enabled: boolean = true) => {
  return useQuery<TimerListResponse>({
    queryKey: ['timerList', id],
    queryFn: () => getTimerList(id),
    enabled,
    refetchInterval: 10_000,
  })
}

export const useGetScreenShareMembers = (id: string) => {
  return useQuery<ScreenShareMembersResponse>({
    queryKey: ['screenShareMembers', id],
    queryFn: () => getScreenShareMembers(id),
  })
}

export const usePostLeaveRoom = () => {
  return useMutation<void, Error, number>({
    mutationFn: async (roomId) => {
      await postLeaveRoom(roomId)
    },
  })
}
