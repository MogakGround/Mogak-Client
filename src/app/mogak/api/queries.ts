import { useQuery } from '@tanstack/react-query'
import {
  MyStatusResponse,
  RoomMemberResponse,
  RoomResponse,
  ScreenShareMembersResponse,
  TimerListResponse,
} from './type'
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
  return useQuery<RoomMemberResponse>({
    queryKey: ['roomMembers', id],
    queryFn: () => getRoomMembers(id),
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
