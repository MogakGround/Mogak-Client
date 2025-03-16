import axiosInstance from '../axiosInstance'
import { PostRoomRequest } from './room.types'

export const postRoom = async (params: PostRoomRequest) => {
  return await axiosInstance.post('/room', params)
}
