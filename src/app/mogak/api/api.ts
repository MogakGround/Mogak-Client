import axiosInstance from '@/app/api/axiosInstance'
import {
  MyStatusResponse,
  RoomMemberResponse,
  RoomResponse,
  ScreenShareMembersResponse,
  TimerListResponse,
} from './type'

export async function getRoomInfo(id: string) {
  const { data } = await axiosInstance.get<RoomResponse>(`/room/${id}`)
  return data
}

export async function getMyStatus(id: string) {
  const { data } = await axiosInstance.get<MyStatusResponse>(`/room/${id}/mystatus`)
  return data
}

export async function getScreenShareMembers(id: string) {
  const { data } = await axiosInstance.get<ScreenShareMembersResponse>(`/room/${id}/screenshare/users`, {
    params: {
      page: 1,
      size: 5,
    },
  })
  return data
}

export async function getRoomMembers(id: string) {
  const { data } = await axiosInstance.get<RoomMemberResponse>(`/room/${id}/participants`)
  return data
}

export async function getTimerList(id: string) {
  const { data } = await axiosInstance.get<TimerListResponse>(`/room/${id}/timers`, {
    params: {
      page: 1,
      size: 5,
    },
  })

  return data
}
export const postLeaveRoom = async (roomId: number) => {
  return await axiosInstance.post(`/room/${roomId}/quit`)
}

export const postLeaveRoomBeacon = (roomId: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/room/${roomId}/quit`
  const blob = new Blob([JSON.stringify({})], { type: 'application/json' })
  
  // sendBeacon은 페이지가 unload되어도 요청을 보장
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, blob)
  }
}
