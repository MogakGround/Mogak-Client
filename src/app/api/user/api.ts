import axiosInstance from '../axiosInstance'
import {
  getCheckNicknameRequest,
  getMyProfileResponseData,
  MyRankingResponseData,
  getRankingListRequest,
  getRankingListResponse,
} from './user.types'

export const getCheckNickname = async (body: getCheckNicknameRequest) => {
  return await axiosInstance.get('check-nickname', {
    params: body,
  })
}

export const getMyProfile = async () => {
  const { data } = await axiosInstance.get<getMyProfileResponseData>('/mypage')

  return data
}

export const getMyRanking = async () => {
  const { data } = await axiosInstance.get<MyRankingResponseData>('/my/ranking')

  return data
}

export const getRankingList = async (body: getRankingListRequest) => {
  const { data } = await axiosInstance.get<getRankingListResponse>('/rankings', {
    params: body,
  })

  return data
}
