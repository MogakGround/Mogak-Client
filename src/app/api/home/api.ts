import axiosInstance from '../axiosInstance'
import { GetRoomsRequest } from './home.types'

// 모각작 방 전체 조회 (시간대별)
export const getAllRoomListRoom = async (params: GetRoomsRequest) => {
  return await axiosInstance.get('/room', { params })
}

// 최근 만들어진 모각방 (TOP 4) 조회
export const getRecentRoomListName = async () => {
  return await axiosInstance.get('/room/recent')
}
