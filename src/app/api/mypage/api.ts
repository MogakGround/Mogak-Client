import axiosInstance from '../axiosInstance'
import { GetChechNickNameRequest, PostProfileRequest, GetRoomsRequest } from './mypage.types'

// 닉네임중복검사
export const getCheckNickName = async (params: GetChechNickNameRequest) => {
  return await axiosInstance.get('/check-nickname', { params })
}

// 내 랭킹 조회
export const getMyRanking = async () => {
  return await axiosInstance.get('/my/ranking')
}

// 내 프로필 조회
export const getMyProfile = async () => {
  const { data } = await axiosInstance.get('/mypage')
  return data
}

// 내 프로필 수정
export const postMyProfile = async (params: PostProfileRequest) => {
  return await axiosInstance.post('/mypage', params)
}

// 내가 만든 모각방 리스트 조회
export const getMyRooms = async (params: GetRoomsRequest) => {
  return await axiosInstance.get('/room/mypage/rooms/imade', { params })
}

// 7일간 방문한 모각방 리스트 조회
export const getSevenDaysRooms = async (params: GetRoomsRequest) => {
  return await axiosInstance.get('/room/mypage/rooms/sevendays', { params })
}
