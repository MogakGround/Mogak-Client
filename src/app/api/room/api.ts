import axiosInstance from '../axiosInstance'
import { GetCheckRoomNameReqeust, PostCreateRoomRequest } from './room.types'

export const postCreateRoom = async (params: PostCreateRoomRequest) => {
  return await axiosInstance.post('/room', params)
}

export const getCheckRoomName = async (params: GetCheckRoomNameReqeust) => {
  return await axiosInstance.get('/room/check-room-name', { params })
}
