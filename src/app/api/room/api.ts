import axiosInstance from '../axiosInstance'
import { GetCheckRoomNameReqeust, PostCreateRoomRequest } from './room.types'

export const postCreateRoom = async (params: PostCreateRoomRequest) => {
  const { data } = await axiosInstance.post('/room', params)
  return data
}

export const getCheckRoomName = async (params: GetCheckRoomNameReqeust) => {
  return await axiosInstance.get('/room/check-room-name', { params })
}
