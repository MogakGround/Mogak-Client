import axiosInstance from '../axiosInstance'
import { GetCheckRoomNameReqeust, PatchRoomInfoRequest, PostCreateRoomRequest } from './room.types'

export const postCreateRoom = async (params: PostCreateRoomRequest) => {
  const { data } = await axiosInstance.post('/room', params)
  return data
}

export const getCheckRoomName = async (params: GetCheckRoomNameReqeust) => {
  return await axiosInstance.get('/room/check-room-name', { params })
}

export const patchRoomInfo = async (roomId: string, params: PatchRoomInfoRequest) => {
  return await axiosInstance.patch(`/room/${roomId}`, params)
}
