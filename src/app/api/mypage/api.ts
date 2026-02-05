import axiosInstance from '../axiosInstance'
import { PatchProfileRequest, GetRoomsRequest, GetRoomsResponseData } from './mypage.types'

// 내 프로필 수정
export const patchMyProfile = async (params: PatchProfileRequest) => {
  const { data } = await axiosInstance.patch('/mypage', params)
  return data
}

// 내가 만든 모각방 리스트 조회
export const getMyRooms = async (params: GetRoomsRequest) => {
  const { data } = await axiosInstance.get<GetRoomsResponseData>('/room/mypage/rooms/imade', { params })
  return data
}

// 7일간 방문한 모각방 리스트 조회
export const getSevenDaysRooms = async (params: GetRoomsRequest) => {
  const { data } = await axiosInstance.get<GetRoomsResponseData>('/room/mypage/rooms/sevendays', { params })
  return data
}
